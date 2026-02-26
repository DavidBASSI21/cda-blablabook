import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class NewUserDTO {
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsBoolean()
  public isPrivate: boolean;

  @IsNumber()
  public roleId: number;
}
