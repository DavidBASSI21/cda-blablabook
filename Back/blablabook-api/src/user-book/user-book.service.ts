import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewUserBookDto } from './dto/new-user-book.dto';
// import { UpdateUserBookDto } from './dto/update-user-book.dto';
import { UserBook } from './entities/user-book.entity';
import { UserBookStatusEnum } from 'generated/prisma';

@Injectable()
export class UserBookService {
  constructor(private prisma: PrismaService) {}

  async create(data: NewUserBookDto): Promise<UserBook> {
    return this.prisma.userBook.create({
      data: {
        status: 'NOT_READ',
        userId: data.userId,
        bookId: data.bookId,
      },
    });
  }

  async getBookReadCount() {
    const count = await this.prisma.userBook.count({
      where: {
        status: 'READ',
      },
    });
    return { count };
  }

  async updateStatus(
    id: number,
    status: UserBookStatusEnum,
    userId: number,
  ): Promise<UserBook> {
    const userBook = await this.prisma.userBook.findUnique({
      where: { id, userId },
    });

    if (!userBook) {
      throw new Error(
        "UserBook non trouvé ou n'appartient pas à l'utilisateur",
      );
    }

    if (userBook.userId !== userId) {
      throw new Error(
        "Vous n'avez pas la permission de mettre à jour le statut de ce livre pour un autre utilisateur",
      );
    }
    return this.prisma.userBook.update({
      where: { id, userId },
      data: { status },
    });
  }

  async remove(id: number, userId: number) {
    const userBook = await this.prisma.userBook.findUnique({
      where: { id, userId },
    });

    if (!userBook) {
      throw new Error(
        "UserBook non trouvé ou n'appartient pas à l'utilisateur",
      );
    }

    if (userBook.userId !== userId) {
      throw new Error(
        "Vous n'avez pas la permission de supprimer ce livre pour un autre utilisateur",
      );
    }

    return this.prisma.userBook.delete({
      where: { id },
    });
  }

  //! Vérifier si un livre fait partie de la liste userBook d'un utilisateur
  async checkIfBookInLibrary(userId: number, bookId: number) {
    const userBook = await this.prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return {
      exists: !!userBook,
      userBook: userBook || null,
    };
  }
}
