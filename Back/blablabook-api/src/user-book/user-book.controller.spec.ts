import { Test, TestingModule } from '@nestjs/testing';
import { UserBookController } from './user-book.controller';
import { UserBookService } from './user-book.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

const mockUserBookService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const allowAllGuard = { canActivate: () => true };

describe('UserBookController', () => {
  let controller: UserBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBookController],
      providers: [{ provide: UserBookService, useValue: mockUserBookService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(allowAllGuard)
      .compile();

    controller = module.get<UserBookController>(UserBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
