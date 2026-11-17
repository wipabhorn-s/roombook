import { PrismaService } from '@/database/prisma.service';
import { CreateRoomDto } from '@/room/dto/create-room.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.room.findMany({
      orderBy: { name: 'asc' },
      include: { bookings: { orderBy: { startTime: 'asc' } } },
    });
  }

  async create(dto: CreateRoomDto) {
    try {
      return await this.prisma.room.create({ data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Room name already exists');
      }
      throw error;
    }
  }
}
