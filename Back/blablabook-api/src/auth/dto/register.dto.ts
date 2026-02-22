import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est requis" })
  public email: string;

  @ApiProperty({
    description:
      'At least 12 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(12, {
    message: 'Le mot de passe doit contenir au moins 12 caractères',
  })
  @MaxLength(128, {
    message: 'Le mot de passe ne peut pas dépasser 128 caractères',
  })
  @Matches(/[a-z]/, {
    message: 'Le mot de passe doit contenir au moins une minuscule',
  })
  @Matches(/[A-Z]/, {
    message: 'Le mot de passe doit contenir au moins une majuscule',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  @Matches(/[^a-zA-Z\d]/, {
    message: 'Le mot de passe doit contenir au moins un caractère spécial',
  })
  public password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  @MaxLength(30, {
    message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
  })
  public username: string;
}
