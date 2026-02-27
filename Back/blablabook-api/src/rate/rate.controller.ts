import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  /**
   * GET /rate/book/:bookId/average
   * Récupérer la note moyenne d'un livre
   */
  @Get('book/:bookId/average')
  async getBookAverageRating(@Param('bookId', ParseIntPipe) bookId: number) {
    const averageRating = await this.rateService.getBookAverageRating(bookId);
    return { bookId, averageRating };
  }

  /**
   * GET /rate/book/:bookId/user
   * Récupérer la note d'un utilisateur pour un livre
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('book/:bookId/user')
  async getUserRateForBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    const rate = await this.rateService.getUserRateForBook(userId, bookId);
    return rate || { message: 'No rating found for this book' };
  }

  /**
   * POST /rate
   * Créer une note pour un livre
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async createRate(
    @Body() createRateDto: CreateRateDto,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.rateService.createRate(userId, createRateDto);
  }

  /**
   * PUT /rate/book/:bookId
   * Modifier la note d'un utilisateur pour un livre
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('book/:bookId')
  async updateRate(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() updateRateDto: UpdateRateDto,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.rateService.updateRate(userId, bookId, updateRateDto);
  }
}
