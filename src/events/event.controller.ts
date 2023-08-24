import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.eventRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.eventRepository.findOneBy({ id });
  }

  @Post()
  async create(@Body() request: CreateEventDto) {
    return await this.eventRepository.save({
      ...request,
      when: new Date(request.when),
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateEventDto,
  ) {
    const event: Event = await this.eventRepository.findOneByOrFail({ id });

    await this.eventRepository.save({
      ...event,
      ...request,
      when: request.when ? new Date(request.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const event: Event = await this.eventRepository.findOneBy({ id });
    await this.eventRepository.remove(event);
  }
}
