import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est requis" })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  public password: string;
}
