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
} from '@nestjs/common';
import { UserBookService } from './user-book.service';
// import { NewUserBookDto } from './dto/new-user-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserBookStatusEnum } from 'generated/prisma';
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
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.userBookService.create({
      userId: userId,
      bookId: bookId,
      status: 'NOT_READ',
    });
  }

  @Patch('/statut/:id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: UserBookStatusEnum },
  ) {
    return this.userBookService.updateStatus(id, body.status);
  }

  @Get()
  findAll() {
    return this.userBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBookService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserBookDto: UpdateUserBookDto) {
  //   return this.userBookService.update(+id, updateUserBookDto);
  // }

  @Delete('/remove/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.userBookService.remove(+id);
  }

  /**
   * GET /userbook/check/:userId/:bookId
   * Vérifier si un livre fait partie de la liste userBook d'un utilisateur
   */
  @Get('check/:userId/:bookId')
  checkIfBookInLibrary(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.userBookService.checkIfBookInLibrary(userId, bookId);
  }
}
