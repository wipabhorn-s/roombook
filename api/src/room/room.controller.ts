import { CreateRoomDto } from '@/room/dto/create-room.dto';
import { RoomService } from '@/room/room.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }
}
