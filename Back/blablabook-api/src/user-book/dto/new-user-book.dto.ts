import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class NewUserBookDto {
  @ApiProperty({
    description: 'Indicates the reading status of the book',
  })
  @IsString()
  public status: string;

  @ApiProperty({
    description: 'The Id of the user',
    required: true,
  })
  @IsNumber()
  public userId: number;

  @ApiProperty({
    description: 'The id of the book',
    required: true,
  })
  @IsNumber()
  public bookId: number;
}
