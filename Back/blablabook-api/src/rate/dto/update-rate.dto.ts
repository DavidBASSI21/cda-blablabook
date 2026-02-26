import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateRateDto {
  @ApiProperty()
  @IsNumber()
  rating: number;
}
