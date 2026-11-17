import { BookingService } from '@/booking/booking.service';
import { CreateBookingDto } from '@/booking/dto/create-booking.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }
}
