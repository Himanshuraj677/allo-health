import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../shared/constants/roles.constant';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Query('name') name?: string, @Query('phone') phone?: string) {
    return this.patientsService.findAll({ name, phone });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Post()
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
