import { Test, TestingModule } from '@nestjs/testing';
import { UserBookService } from './user-book.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrismaService = {
  userBook: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('UserBookService', () => {
  let service: UserBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserBookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserBookService>(UserBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
