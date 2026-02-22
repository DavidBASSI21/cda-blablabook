import { PartialType } from '@nestjs/mapped-types';
import { NewUserBookDto } from './new-user-book.dto';
import { IsString } from 'class-validator';

export class UpdateUserBookDto extends PartialType(NewUserBookDto) {
  @IsString()
  status?: string;
}
