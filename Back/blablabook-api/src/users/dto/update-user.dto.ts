import { PartialType } from '@nestjs/mapped-types';
import { NewUserDTO } from './new-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO extends PartialType(NewUserDTO) {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
