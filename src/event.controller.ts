import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EventEntity } from './event.entity';

@Controller('events')
export class EventsController {
  private events: EventEntity[] = [];
  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.events.find((event) => event.id === parseInt(id));
  }

  @Post()
  create(@Body() request: CreateEventDto) {
    return request;
  }

  @Patch(':id')
  update(@Param('id') id: UpdateEventDto) {
    return id;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    console.log(id);
  }
}
