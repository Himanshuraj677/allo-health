// src/appointments/appointments.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PatientsService } from '../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';
import { QueuesService } from '../queues/queues.service';
import { QueueStatus } from '../queues/entities/queue.entity';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
    private queuesService: QueuesService,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const patient = await this.patientsService.findOne(dto.patientId);
    const doctor = await this.doctorsService.findOne(dto.doctorId);

    // 1. Check patient in queue
    const queueEntry = (await this.queuesService.findAll({ status: QueueStatus.WAITING }))
      .find(q => q.patient.id === patient.id);
    if (!queueEntry) throw new BadRequestException('Patient must be in the queue to get appointed');

    // 2. Check patient has no active appointment
    const existingAppt = await this.repo.findOne({
      where: { patient: { id: patient.id }, status: AppointmentStatus.BOOKED },
    });
    if (existingAppt) throw new BadRequestException('Patient already has an active appointment');

    // 3. Check if time is within doctor's working hours
    const appointmentTime = dayjs(`${dto.appointment_date} ${dto.appointment_time}`);
    const workStart = dayjs(`${dto.appointment_date} ${doctor.work_start_time}`);
    const workEnd = dayjs(`${dto.appointment_date} ${doctor.work_end_time}`);

    if (appointmentTime.isBefore(workStart) || appointmentTime.isAfter(workEnd)) {
      throw new BadRequestException(
        `Doctor is only available between ${doctor.work_start_time} and ${doctor.work_end_time}`,
      );
    }

    // 4. Check break times
    if (doctor.breaks && doctor.breaks.length > 0) {
      for (const br of doctor.breaks) {
        const breakStart = dayjs(`${dto.appointment_date} ${br.start}`);
        const breakEnd = dayjs(`${dto.appointment_date} ${br.end}`);
        if (appointmentTime.isBefore(breakEnd) && appointmentTime.add(doctor.slot_duration, 'minute').isAfter(breakStart)) {
          throw new BadRequestException('Selected time falls within doctor break time');
        }
      }
    }

    // 5. Calculate appointment end time
    const apptEndTime = appointmentTime.add(doctor.slot_duration, 'minute');
    if (apptEndTime.isAfter(workEnd)) {
      throw new BadRequestException('Selected slot exceeds doctor working hours');
    }

    // 6. Check for overlapping appointments
    const doctorAppointments = await this.repo.find({
      where: {
        doctor: { id: doctor.id },
        appointment_date: dto.appointment_date,
        status: AppointmentStatus.BOOKED,
      },
    });

    const isConflict = doctorAppointments.some(appt => {
      const existingStart = dayjs(`${appt.appointment_date} ${appt.appointment_time}`);
      const existingEnd = existingStart.add(doctor.slot_duration, 'minute');
      return appointmentTime.isBefore(existingEnd) && apptEndTime.isAfter(existingStart);
    });

    if (isConflict) {
      throw new BadRequestException('Selected time slot overlaps with another appointment');
    }

    // 7. Create appointment
    const appt = this.repo.create({
      patient,
      doctor,
      appointment_date: dto.appointment_date,
      appointment_time: dto.appointment_time,
    });
    const saved = await this.repo.save(appt);

    // 8. Remove from queue
    await this.queuesService.remove(queueEntry.id);

    return saved;
  }

  async getAvailableSlots(doctorId: number, date: string) {
    const doctor = await this.doctorsService.findOne(doctorId);

    const workStart = dayjs(`${date} ${doctor.work_start_time}`);
    const workEnd = dayjs(`${date} ${doctor.work_end_time}`);
    const slotDuration = doctor.slot_duration;

    // Fetch booked appointments for the day
    const bookedAppointments = await this.repo.find({
      where: {
        doctor: { id: doctor.id },
        appointment_date: date,
        status: AppointmentStatus.BOOKED,
      },
    });

    // Convert booked appointments into time ranges
    const bookedRanges = bookedAppointments.map(appt => {
      const start = dayjs(`${appt.appointment_date} ${appt.appointment_time}`);
      const end = start.add(slotDuration, 'minute');
      return { start, end };
    });

    // Convert doctor breaks into time ranges
    const breakRanges = (doctor.breaks || []).map(br => {
      const start = dayjs(`${date} ${br.start}`);
      const end = dayjs(`${date} ${br.end}`);
      return { start, end };
    });

    const slots: string[] = [];
    let currentTime = workStart.clone();

    while (currentTime.clone().add(slotDuration, 'minute').isSameOrBefore(workEnd)) {
      const slotEnd = currentTime.clone().add(slotDuration, 'minute');

      // Check overlap with booked slots
      const bookedOverlap = bookedRanges.some(range =>
        currentTime.isBefore(range.end) && slotEnd.isAfter(range.start),
      );

      // Check overlap with breaks
      const breakOverlap = breakRanges.some(range =>
        currentTime.isBefore(range.end) && slotEnd.isAfter(range.start),
      );

      if (!bookedOverlap && !breakOverlap) {
        slots.push(currentTime.format('HH:mm'));
      }

      currentTime = currentTime.add(slotDuration, 'minute');
    }

    return {
      doctorId,
      date,
      availableSlots: slots,
    };
  }

  findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: number) {
    const appt = await this.repo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    const appt = await this.findOne(id);
    Object.assign(appt, dto);
    return this.repo.save(appt);
  }

  async remove(id: number) {
    const appt = await this.findOne(id);
    return this.repo.remove(appt);
  }
}
