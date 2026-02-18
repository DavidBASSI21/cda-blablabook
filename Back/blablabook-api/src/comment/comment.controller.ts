import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../generated/prisma';

@Controller('comments')
export class CommentController {
  constructor(private service: CommentService) {}

  @Get('comment-count')
  async getCommentCount() {
    return this.service.getCommentCount();
  }

  @Get('reported-comment-count')
  async getReportedCommentCount() {
    return this.service.getReportedCommentCount();
  }

  @Get('latest-per-book')
  latestPerBook(@Query('take') take?: string) {
    const n = take ? Number(take) : 10;
    return this.service.latestCommentPerBook(
      Number.isFinite(n) ? Math.min(n, 10) : 10,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.service.createComment(userId, createCommentDto);
  }

  //! GET ALL REPORTED COMMENTS
  @Get()
  async findAll(
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    const skip = Number(page) * Number(limit);
    const take = Number(limit);
    const { data, total } = await this.service.findAll(skip, take);
    //  const reportedComments = data.flatMap((comment) => reportedComments);
    console.log('--- REQUETE RECUE ---');
    return { data, total };
  }
}
