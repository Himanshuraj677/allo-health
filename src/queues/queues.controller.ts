import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLES } from '../shared/constants/roles.constant';
import { QueueStatus } from './entities/queue.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Get()
  findAll(@Query('status') status?: QueueStatus, @Query('priority') priority?: string) {
    return this.queuesService.findAll({ status, priority });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.findOne(id);
  }

  @Post()
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  create(@Body() dto: CreateQueueDto) {
    return this.queuesService.create(dto);
  }

  @Put(':id')
  @Roles(ROLES.ADMIN, ROLES.STAFF)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQueueDto) {
    return this.queuesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.remove(id);
  }
}
