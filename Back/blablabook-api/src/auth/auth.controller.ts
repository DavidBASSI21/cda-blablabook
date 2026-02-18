import { Controller, Post, Body } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth.')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiForbiddenResponse({
    description:
      'Email invalide | Email existant | Mot de passe trop court | Mot de passe sans minuscule | Mot de passe sans majuscule | Mot de passe sans chiffre',
  })
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.signUp(registerDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Authentification réussie' })
  @ApiForbiddenResponse({
    description: 'Email inexistant | Mot de passe incorrect',
  })
  login(@Body() loginDto: LoginDTO) {
    return this.authService.signIn({
      email: loginDto.email,
      password: loginDto.password,
    });
  }
}
