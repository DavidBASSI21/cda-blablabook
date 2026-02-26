import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

const mockUser = {
  id: 1,
  email: 'alice@example.com',
  username: 'alice',
  password: '$2a$12$hashed',
  isPrivate: false,
  profilePicture: null,
  roleId: 2,
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findByUsername: jest.fn(),
  findByEmailWithRole: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── signUp ───────────────────────────────────────────────────────────────

  describe('signUp', () => {
    const validDto = {
      email: 'alice@example.com',
      password: 'ValidPass1!extra',
      username: 'alice',
    };

    it('registers a new user and returns a token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.signUp(validDto);

      expect(mockUsersService.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws BadRequestException for an invalid email format', async () => {
      await expect(
        service.signUp({ ...validDto, email: 'not-an-email' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signUp(validDto)).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException when username is already taken', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      await expect(service.signUp(validDto)).rejects.toThrow(ConflictException);
    });

    it.each([
      ['too short', 'Short1!'],
      ['no uppercase', 'nouppercase1!extra'],
      ['no lowercase', 'NOLOWERCASE1!EXTRA'],
      ['no digit', 'NoDigitHere!extra'],
      ['no special char', 'NoSpecialChar1extra'],
    ])('throws BadRequestException when password is %s', async (_, pwd) => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(
        service.signUp({ ...validDto, password: pwd }),
      ).rejects.toThrow(BadRequestException);
    });

    it('uses email prefix as username when no username is provided', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        username: 'alice',
      });

      await service.signUp({
        email: 'alice@example.com',
        password: 'ValidPass1!extra',
        username: '',
      });

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'alice' }),
      );
    });
  });

  // ─── signIn ───────────────────────────────────────────────────────────────

  describe('signIn', () => {
    // Use a real bcrypt hash so bcrypt.compare works correctly in unit tests
    const PLAIN_PASSWORD = 'ValidPass1!extra';

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
      const hashed = await bcrypt.hash(PLAIN_PASSWORD, 4);
      mockUsersService.findByEmailWithRole.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });
    });

    it('returns a token for valid credentials', async () => {
      const result = await service.signIn({
        email: mockUser.email,
        password: PLAIN_PASSWORD,
      });

      expect(result).toHaveProperty('token', 'mock.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmailWithRole.mockResolvedValue(null);

      await expect(
        service.signIn({
          email: 'ghost@example.com',
          password: PLAIN_PASSWORD,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      await expect(
        service.signIn({ email: mockUser.email, password: 'WrongPass1!extra' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── validateUser ─────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('returns the user when found', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.validateUser(1);
      expect(result).toEqual(mockUser);
    });

    it('returns null when user does not exist', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      const result = await service.validateUser(999);
      expect(result).toBeNull();
    });
  });

  // ─── refreshToken ─────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('returns a new token for an existing user', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.refreshToken(1);
      expect(result).toHaveProperty('token', 'mock.jwt.token');
    });

    it('throws UnauthorizedException when user is not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
