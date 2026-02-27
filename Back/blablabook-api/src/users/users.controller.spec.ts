import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { SelfOrAdminGuard } from 'src/auth/guards/selfOrAdmin.guard';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';

const mockUsersService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  getProfileById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getUserCount: jest.fn(),
};

const allowAllGuard = { canActivate: () => true };

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AdminGuard)
      .useValue(allowAllGuard)
      .overrideGuard(SelfOrAdminGuard)
      .useValue(allowAllGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(allowAllGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
