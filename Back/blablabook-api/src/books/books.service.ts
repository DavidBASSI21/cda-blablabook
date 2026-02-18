/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { CommentService } from 'src/comment/comment.service';
import {
  OpenLibraryDoc,
  OpenLibraryEdition,
  OpenLibrarySearchResponse,
  OpenLibraryWork,
} from './types/books.type';
import { AxiosResponse } from 'axios';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/client';

/* Récupération des livres depuis l'API d'OpenLibrary. 
Récupérations des Work contenant la description, et l'auteur principal d'une oeuvre (le concept du livre)
Récupération des Editions contenant les informations sur le livre en question. 1 Work peut avoir plusieurs éditions. L'édition contient l'isbn, le nombre de page, l'éditeur, la couverture, etc.
Le doc = le résultat de la recherche. Il renvoie la key du worek et une liste d'edition_key nous on prend juste la première 
*/

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly commentService: CommentService,
  ) {}

  async getBooksFromOpenLibraryApi() {
    // 1. On ne demande à l'API de recherche que les champs dont on a VRAIMENT besoin
    const { data } = await firstValueFrom(
      this.httpService.get<OpenLibrarySearchResponse>(
        `https://openlibrary.org/search.json?q=language:fre AND isbn:[* TO *] AND number_of_pages_median:[1 TO *]&limit=150&fields=title,author_name,edition_key,cover_i,isbn,number_of_pages_median,key`,
      ),
    );

    const docs = data.docs ?? [];
    for (const doc of docs) {
      // On ignore les livres qui n'ont pas d'édition sinon on ne pourra pas récupérer le détail du livre
      if (!doc.edition_key?.length) continue;
      try {
        // Définition de l'identifiant openlibrary pour l'édition
        const editionOlid = doc.edition_key[0];
        // Récupération des détails du livre via l'id de l'édition:
        const editionResponse = await firstValueFrom(
          this.httpService
            .get<OpenLibraryEdition>(
              `https://openlibrary.org/books/${editionOlid}.json`,
            )
            .pipe(catchError(() => of(null))),
        );

        const edition = editionResponse?.data;
        if (!edition) continue;
        // Préparation des données :
        // Extraction de l'année de publication
        let pubDate: string | null = null;
        const rawDate = edition.publish_date;
        if (rawDate) {
          const yearMatch = rawDate.match(/\d{4}/);
          if (yearMatch) {
            pubDate = new Date(parseInt(yearMatch[0]), 0, 1).toString();
          }
        }
        // Récupération de l'isbn
        const isbn = edition.isbn_13?.[0] || edition.isbn_10?.[0];

        let summary: string | null = null;

        // Récupérati
        if (doc.key) {
          const workResponse = await firstValueFrom(
            this.httpService
              .get<OpenLibraryWork>(`https://openlibrary.org${doc.key}.json`)
              .pipe(catchError(() => of(null))),
          );

          const work = workResponse?.data;
          if (work?.description) {
            summary =
              typeof work.description === 'object'
                ? work.description.value
                : work.description;
          }
          // Si pas de description dans le work on va voir du côté de l'excerpt
          else if (work?.excerpts && work.excerpts.length > 0) {
            summary = work.excerpts[0].excerpt;
          }
        }
        // Récupération de la couverture. On va déjà piocher dans les éléments qui ont la prorpéité 'covers'
        // Ensuite on va checker les élements qui ont la propriété 'cover'
        // Si on a ni l'un ni l'autre, on va checker dans le document, la propriété 'cover_i'
        const coverId =
          edition.covers && edition.covers.length > 0
            ? edition.covers[0]
            : Array.isArray(edition.cover)
              ? edition.cover[0]
              : edition.cover || doc.cover_i;
        // 4. Insertion propre
        await this.prisma.book.create({
          data: {
            title: edition.title || doc.title || 'Inconnu',
            author: doc.author_name?.join(', ') || 'Auteur inconnu',
            page_count: edition.number_of_pages ?? 0,
            publishing_date: pubDate || Date(),
            summary: summary,
            publisher: edition.publishers?.[0] || null,
            isbn: isbn || null,
            cover: coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
              : null,
            averageRating: 0,
          },
        });
      } catch (error) {
        console.log('y a une erreur ! ', error);
      }
    }
  }

  // Fonction utilitaire privée pour éviter de répéter le code de transformation
  private mapBookWithUserBookId(books: any[]) {
    return books.map((book) => {
      const userBookEntry =
        book.userBooks && book.userBooks.length > 0 ? book.userBooks[0] : null;

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        userBookId: userBookEntry ? userBookEntry.id : null,
        status: userBookEntry ? userBookEntry.status : null,
      };
    });
  }
  async getBooks(userId?: number) {
    const books = await this.prisma.book.findMany({
      include: {
        userBooks: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
    });

    return this.mapBookWithUserBookId(books);
  }

  async getRandomBooks(take: number, userId?: number) {
    const booksCount = await this.prisma.book.count();
    const skip = Math.max(0, Math.floor(Math.random() * (booksCount - take)));
    const books = await this.prisma.book.findMany({
      take: take,
      skip: skip,
      select: {
        id: true,
        title: true,
        author: true,
        cover: true,
        userBooks: userId
          ? {
              where: { userId: userId },
              select: { id: true, status: true },
            }
          : false,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return this.mapBookWithUserBookId(books);
  }

  async getMostPopularBooks(take: number, userId?: number) {
    const books = await this.prisma.book.findMany({
      take: take,
      select: {
        id: true,
        title: true,
        author: true,
        cover: true,
        userBooks: userId
          ? {
              where: { userId: userId },
              select: { id: true, status: true },
            }
          : false,
      },
      orderBy: {
        averageRating: 'desc',
      },
    });
    return this.mapBookWithUserBookId(books);
  }

  async getLatestBooks(take: number, userId?: number) {
    const books = await this.prisma.book.findMany({
      take: take,
      select: {
        id: true,
        title: true,
        author: true,
        cover: true,
        userBooks: userId
          ? {
              where: { userId: userId },
              select: { id: true, status: true },
            }
          : false,
      },
      orderBy: {
        publishing_date: 'desc',
      },
    });
    return this.mapBookWithUserBookId(books);
  }

  //! GET BOOK BY ID
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        rates: true,
      },
    });

    if (!book) {
      throw new Error('Livre non trouvé');
    }

    return book;
  }
  async mostAddedBooks(take = 10, userId?: number) {
    // count the number of times each bookId appears in userBook and return the top n books
    const groupedUserBooks = await this.prisma.userBook.groupBy({
      by: ['bookId'],
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

    const bookIds = groupedUserBooks.map((group) => group.bookId);

    const books = await this.prisma.book.findMany({
      where: {
        id: { in: bookIds },
      },
      select: {
        id: true,
        title: true,
        author: true,
        cover: true,
        userBooks: userId
          ? {
              where: { userId: userId },
              select: { id: true, status: true },
            }
          : false,
      },
    });
    return groupedUserBooks.map((group) => {
      const book = books.find((b) => b.id === group.bookId);
      return {
        ...book,
        addedCount: group._count.bookId,
      };
    });
  }

  async mostCommentedBooks(take = 10, userId?: number) {
    const groupedComments =
      await this.commentService.numbeOfCommentsPerBook(take);

    const bookIds = groupedComments.map((group) => group.bookId);

    const books = await this.prisma.book.findMany({
      where: {
        id: { in: bookIds },
      },
      select: {
        id: true,
        title: true,
        author: true,
        cover: true,
        userBooks: userId
          ? {
              where: { userId: userId },
              select: { id: true, status: true },
            }
          : false,
      },
    });

    return groupedComments.map((group) => {
      const book = books.find((b) => b.id === group.bookId);
      return {
        ...book,
        commentCount: group._count.bookId,
      };
    });
  }

  async searchBooks(
    query: string,
    page: number = 1,
    pageSize: number = 20,
    userId?: number,
  ) {
    const skip = (page - 1) * pageSize;
    const books = await this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        userBooks: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
      skip,
      take: pageSize,
    });
    return books;
  }

  async searchBooksWithOpenLibraryApi(query: string, limit: number = 20) {
    if (query.trim().length < 3) {
      throw new NotFoundException(
        'La recherche doit contenir au moins 3 caractères.',
      );
    }
    if (limit > 50) {
      limit = 50;
    }
    // do NOT remove the key field, it is needed to receive value in the editions field
    const { data } = await firstValueFrom(
      this.httpService.get<OpenLibrarySearchResponse>(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query,
        )} AND language:fre AND isbn:[* TO *] AND number_of_pages_median:[1 TO *]&limit=${limit}&fields=title,author_name,editions,edition_key,key,cover_i,isbn`,
      ),
    );
    const resultWithEditionKey = data.docs.filter(
      (doc) => doc.edition_key && doc.edition_key.length > 0,
    );
    return resultWithEditionKey;
  }

  async importExternalBookToDatabase(book: OpenLibraryDoc) {
    if (!book.edition_key || book.edition_key.length === 0) {
      throw new NotFoundException(
        "Le livre fourni ne contient pas d'édition valide.",
      );
    }
    let editionResponse: AxiosResponse<OpenLibraryEdition> | null = null;
    const editionOlid = book.editions.docs[0].key.split('/books/').pop();
    try {
      editionResponse = await firstValueFrom(
        this.httpService
          .get<OpenLibraryEdition>(
            `https://openlibrary.org/books/${editionOlid}.json`,
          )
          .pipe(catchError(() => of(null))),
      );
    } catch (error) {
      console.log("Erreur lors de la récupération de l'édition :", error);
      throw new NotFoundException(
        "Impossible de récupérer les détails du livre depuis l'API externe.",
      );
    }
    const edition = editionResponse?.data;
    if (!edition) return null;

    let pubDate: string | null = null;
    const rawDate = edition.publish_date;
    if (rawDate) {
      const yearMatch = rawDate.match(/\d{4}/);
      if (yearMatch) {
        pubDate = new Date(parseInt(yearMatch[0]), 0, 1).toString();
      }
    }
    const isbn = edition.isbn_13?.[0] || edition.isbn_10?.[0];

    let summary: string | null = null;

    // Récupérati
    if (book.key) {
      const workResponse = await firstValueFrom(
        this.httpService
          .get<OpenLibraryWork>(`https://openlibrary.org${book.key}.json`)
          .pipe(catchError(() => of(null))),
      );

      const work = workResponse?.data;
      if (work?.description) {
        summary =
          typeof work.description === 'object'
            ? work.description.value
            : work.description;
      }
      // Si pas de description dans le work on va voir du côté de l'excerpt
      else if (work?.excerpts && work.excerpts.length > 0) {
        summary = work.excerpts[0].excerpt;
      }
    }

    const coverId =
      edition.covers && edition.covers.length > 0
        ? edition.covers[0]
        : Array.isArray(edition.cover)
          ? edition.cover[0]
          : edition.cover;
    try {
      const newBook = await this.prisma.book.create({
        data: {
          title: edition.title || 'Inconnu',
          author: book.author_name?.join(', ') || 'Auteur inconnu',
          page_count: edition.number_of_pages ?? 0,
          publishing_date: pubDate || Date(),
          summary: summary,
          publisher: edition.publishers?.[0] || null,
          isbn: isbn || null,
          cover: coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : null,
          averageRating: 0,
        },
      });
      return newBook;
    } catch (error) {
      // Check if it's a Prisma unique constraint violation
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Duplicate entry - return the existing book instead
          const existingBook = await this.prisma.book.findUnique({
            where: { isbn: isbn || undefined },
          });
          if (existingBook) {
            return existingBook;
          }
          throw new ConflictException(
            'Ce livre existe déjà dans la base de données.',
          );
        }
      }
      // Re-throw other errors
      throw error;
    }
  }
}
