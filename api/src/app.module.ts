import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@/config/env.validation';
import { DatabaseModule } from '@/database/database.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    // ConfigModule.forRoot(...) คือ module ของ Nest ที่อ่าน .env ให้
    // ส่วน forRoot แปลว่าตั้งค่าครั้งเดียวที่ module ราก
    ConfigModule.forRoot({
      // ให้ทุก module ใช้ ConfigService ได้เลยโดยไม่ต้อง import ConfigModule ซ้ำทุกที่
      isGlobal: true,
      // validate (ย่อมาจาก validate: validate) บอกว่า "อ่าน .env แล้วส่งให้ฟังก์ชันนี้ตรวจก่อนนะ"
      validate,
    }),
    DatabaseModule,
    RoomModule,
    BookingModule,
  ],
})
export class AppModule {}
