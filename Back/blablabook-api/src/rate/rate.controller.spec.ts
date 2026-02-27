import { Test, TestingModule } from '@nestjs/testing';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

const mockRateService = {
  getBookAverageRating: jest.fn(),
  getUserRateForBook: jest.fn(),
  createRate: jest.fn(),
  updateRate: jest.fn(),
};

const allowAllGuard = { canActivate: () => true };

describe('RateController', () => {
  let controller: RateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [{ provide: RateService, useValue: mockRateService }],
    })
      .overrideGuard(AuthGuard).useValue(allowAllGuard)
      .compile();

    controller = module.get<RateController>(RateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
