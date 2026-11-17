import { Trim } from '@/common/decorator/trim.decorator';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  roomId: number;

  @Trim()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  bookerName: string;

  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  endTime: Date;
}
