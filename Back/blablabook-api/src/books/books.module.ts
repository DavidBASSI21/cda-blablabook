import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentService } from 'src/comment/comment.service';
import { UsersModule } from 'src/users/users.module';
// import { PrismaService } from 'src/prisma/prisma.service';
//import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule, PrismaModule, UsersModule],
  controllers: [BooksController],
  providers: [BooksService, CommentService],
})
export class BooksModule {}
