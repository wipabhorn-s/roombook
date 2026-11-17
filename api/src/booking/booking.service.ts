import { CreateBookingDto } from '@/booking/dto/create-booking.dto';
import { PrismaService } from '@/database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('End-time must be after start-time');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const overlap = await this.prisma.booking.findFirst({
      where: {
        roomId: dto.roomId,
        startTime: { lt: dto.endTime },
        endTime: { gt: dto.startTime },
      },
    });

    if (overlap) {
      throw new ConflictException('Room is already booked for this time slot');
    }

    return this.prisma.booking.create({ data: dto });
  }
}
