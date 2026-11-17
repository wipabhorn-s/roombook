// api\src\room\dto\create-room.dto.ts
import { Trim } from '@/common/decorator/trim.decorator';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
