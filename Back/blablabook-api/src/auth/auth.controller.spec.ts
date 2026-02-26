import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const TOKEN_RESPONSE = {
  token: 'mock.jwt.token',
  token_type: 'Bearer',
  user: {
    id: 1,
    username: 'alice',
    isPrivate: false,
    profilePicture: null,
    roleId: 2,
  },
};

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register', () => {
    const dto = {
      email: 'alice@example.com',
      password: 'ValidPass1!extra',
      username: 'alice',
    };

    it('returns the token response on successful registration', async () => {
      mockAuthService.signUp.mockResolvedValue(TOKEN_RESPONSE);

      const result = await controller.register(dto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(TOKEN_RESPONSE);
    });

    it('propagates BadRequestException for invalid email', async () => {
      mockAuthService.signUp.mockRejectedValue(
        new BadRequestException("Format d'email invalide"),
      );

      await expect(
        controller.register({ ...dto, email: 'bad-email' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('propagates ConflictException when email already exists', async () => {
      mockAuthService.signUp.mockRejectedValue(
        new ConflictException('Un utilisateur avec cet email existe déjà'),
      );

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });

    it('propagates BadRequestException for weak password', async () => {
      mockAuthService.signUp.mockRejectedValue(
        new BadRequestException('Le mot de passe doit contenir…'),
      );

      await expect(
        controller.register({ ...dto, password: 'weak' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    const dto = {
      email: 'alice@example.com',
      password: 'ValidPass1!extra',
    };

    it('returns the token response on successful login', async () => {
      mockAuthService.signIn.mockResolvedValue(TOKEN_RESPONSE);

      const result = await controller.login(dto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
      });
      expect(result).toEqual(TOKEN_RESPONSE);
    });

    it('propagates UnauthorizedException for unknown email', async () => {
      mockAuthService.signIn.mockRejectedValue(
        new UnauthorizedException('Identifiants invalides'),
      );

      await expect(
        controller.login({
          email: 'ghost@example.com',
          password: dto.password,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('propagates UnauthorizedException for wrong password', async () => {
      mockAuthService.signIn.mockRejectedValue(
        new UnauthorizedException('Identifiants invalides'),
      );

      await expect(
        controller.login({ ...dto, password: 'WrongPass1!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
