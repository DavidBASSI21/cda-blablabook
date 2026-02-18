import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getCommentCount() {
    const count = await this.prisma.comment.count();
    return { count };
  }

  async getReportedCommentCount() {
    const count = await this.prisma.comment.count({
      where: {
        reportCounter: {
          gte: 5,
        },
      },
    });

    return { count };
  }
  async createComment(userId: number, dto: CreateCommentDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
      select: { id: true },
    });

    if (!book) throw new NotFoundException('Livre introuvable');

    return this.prisma.comment.create({
      data: {
        title: dto.title,
        content: dto.content,

        reportCounter: 0,
        status: 'ACTIVE',
        date: new Date(),

        user: { connect: { id: userId } },
        book: { connect: { id: dto.bookId } },
      },
      include: {
        user: { select: { id: true, username: true, profilePicture: true } },
        book: { select: { id: true, title: true, author: true, cover: true } },
      },
    });
  }

  async reportComment(commentId: number, userId: number) {
    const exists = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Commentaire introuvable');

    try {
      await this.prisma.$transaction([
        this.prisma.commentReport.create({
          data: { commentId, userId },
        }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { reportCounter: { increment: 1 } },
        }),
      ]);

      return { ok: true };
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('Déjà signalé');
      }
      throw e;
    }
  }

  async latestCommentPerBook(take = 10) {
    return this.prisma.comment.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: {
        date: 'desc',
      },
      distinct: ['bookId'],
      take,
      include: {
        book: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async numbeOfCommentsPerBook(take = 10) {
    const groupedComments = await this.prisma.comment.groupBy({
      by: ['bookId'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        bookId: true,
      },
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
      take,
    });
    return groupedComments;
  }
}
