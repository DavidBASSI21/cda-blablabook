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
  Req,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import express from 'express';

@Controller('comments')
export class CommentController {
  constructor(private service: CommentService) {}

  @Get()
  async getAllComments(
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.findAll(Number(page) * Number(limit), Number(limit));
  }

  @Get('comment-count')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async getCommentCount() {
    return this.service.getCommentCount();
  }

  @Get('comments-to-moderate')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async getCommentsToModerate(
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getCommentsToModerate(Number(page), Number(limit));
  }

  @Patch(':id/approve')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async approveComment(@Param('id', ParseIntPipe) id: number) {
    return this.service.approveComment(id);
  }

  @Patch(':id/reject')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async rejectComment(@Param('id', ParseIntPipe) id: number) {
    return this.service.rejectComment(id);
  }

  @Get('reported-comment-count')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
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
  @ApiBearerAuth()
  @Post(':id/report')
  report(@Param('id', ParseIntPipe) id: number, @Req() req: express.Request) {
    return this.service.reportComment(id, req.user!.id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: express.Request,
  ) {
    const userId = req.user!.id;
    return this.service.createComment(userId, createCommentDto);
  }
}
