import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { NewUserDTO } from 'src/users/dto/new-user.dto';
import { User } from 'generated/prisma';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { UserWithRole } from 'src/users/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDTO) {
    if (!this.isValidEmail(registerDto.email)) {
      throw new BadRequestException("Format d'email invalide");
    }

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    if (registerDto.username) {
      const existingUsername = await this.usersService.findByUsername(
        registerDto.username,
      );
      if (existingUsername) {
        throw new ConflictException("Ce nom d'utilisateur est déjà pris");
      }
    }

    if (!this.isValidPassword(registerDto.password)) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 12 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const userDto: NewUserDTO = {
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username || registerDto.email.split('@')[0],
      roleId: 2,
      isPrivate: false,
    };

    try {
      const user: User = await this.usersService.create(userDto);
      return this.generateTokenResponse(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  async signIn(loginDto: LoginDTO) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithRole(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.generateTokenResponse(user);
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }

  async refreshToken(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(
    user: UserWithRole | Omit<User, 'password' | 'email'>,
  ) {
    const token = this.jwtService.sign(
      { id: user.id, type: 'auth' },
      { expiresIn: '7d' },
    );

    return {
      token: token,
      token_type: 'Bearer',
      user: {
        id: user?.id,
        username: user?.username,
        isPrivate: user?.isPrivate,
        profilePicture: user?.profilePicture,
        roleId: user?.roleId,
      },
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return (
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z\d]/.test(password)
    );
  }
}
