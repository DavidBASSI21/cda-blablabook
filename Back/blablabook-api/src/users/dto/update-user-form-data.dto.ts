import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserFormDataDTO {
  @IsOptional()
  @IsString()
  public username: string;

  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  public password: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  public isPrivate: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  public roleId: number;

  @IsOptional()
  @IsString()
  public avatar?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public profilePicture?: string;
}
