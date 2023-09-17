import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Within the findAll route');
    const events: Event[] = await this.eventRepository.find();
    this.logger.debug(`Found  ${events.length} events`);
    return events;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event: Event | null = await this.eventRepository.findOne({
      where: { id },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException();
    }

    return event;
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
    const event: Event | null = await this.eventRepository.findOneBy({ id });

    if (!event) throw new NotFoundException();

    await this.eventRepository.save({
      ...event,
      ...request,
      when: request.when ? new Date(request.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const event: Event | null = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }
    await this.eventRepository.remove(event);
  }
}
