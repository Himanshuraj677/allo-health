import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../shared/constants/roles.constant';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('available-slots')
  findAvailableSlots(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
