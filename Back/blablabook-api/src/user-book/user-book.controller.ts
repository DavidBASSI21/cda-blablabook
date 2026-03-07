import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  HttpCode,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserBookService } from './user-book.service';
// import { NewUserBookDto } from './dto/new-user-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserBookStatusEnum } from 'generated/prisma';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import express from 'express';
// import { UpdateUserBookDto } from './dto/update-user-book.dto';

@ApiTags('Userbook')
@Controller('userbook')
export class UserBookController {
  constructor(private readonly userBookService: UserBookService) {}

  @Get('book-read-count')
  async getBookReadCount() {
    return this.userBookService.getBookReadCount();
  }

  @Post('/add/:userId/:bookId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Req() request: express.Request,
  ) {
    if (request.user!.id !== userId) {
      throw new UnauthorizedException(
        "Vous n'avez pas la permission d'ajouter un livre à la bibliothèque d'un autre utilisateur",
      );
    }
    return this.userBookService.create({
      userId: userId,
      bookId: bookId,
      status: 'NOT_READ',
    });
  }

  @Patch('/status/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: UserBookStatusEnum },
    @Req() request: express.Request,
  ) {
    return this.userBookService.updateStatus(id, body.status, request.user!.id);
  }

  // @Get()
  // findAll() {
  //   return this.userBookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userBookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserBookDto: UpdateUserBookDto) {
  //   return this.userBookService.update(+id, updateUserBookDto);
  // }

  @Delete('/remove/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: express.Request,
  ) {
    return this.userBookService.remove(id, request.user!.id);
  }

  /**
   * GET /userbook/check/:userId/:bookId
   * Vérifier si un livre fait partie de la liste userBook d'un utilisateur
   */
  @Get('check/:userId/:bookId')
  @UseGuards(AuthGuard)
  checkIfBookInLibrary(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Req() request: express.Request,
  ) {
    if (request.user!.id !== userId) {
      throw new UnauthorizedException(
        "Vous n'avez pas la permission de vérifier la bibliothèque d'un autre utilisateur",
      );
    }
    return this.userBookService.checkIfBookInLibrary(userId, bookId);
  }
}
