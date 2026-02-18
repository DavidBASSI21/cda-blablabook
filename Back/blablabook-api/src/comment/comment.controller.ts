import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Query,
  UseGuards,
  Param,
  ParseIntPipe,
  Req
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
  @Post(':id/report')
  report(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.service.reportComment(id, req.user.id);
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
}
