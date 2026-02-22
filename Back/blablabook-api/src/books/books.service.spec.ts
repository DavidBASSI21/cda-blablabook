import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { CommentService } from 'src/comment/comment.service';
import { of } from 'rxjs';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockBook = {
  id: 1,
  title: 'Le Petit Prince',
  author: 'Antoine de Saint-Exupéry',
  cover: 'https://covers.openlibrary.org/b/id/123-M.jpg',
  userBooks: [],
};

const mockBookWithUserBook = {
  ...mockBook,
  userBooks: [{ id: 42, status: 'READ' }],
};

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrismaService = {
  book: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  userBook: {
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockHttpService = {
  get: jest.fn(),
};

const mockCommentService = {
  numbeOfCommentsPerBook: jest.fn(),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: CommentService, useValue: mockCommentService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getBooks ──────────────────────────────────────────────────────────────

  describe('getBooks', () => {
    it('returns mapped books without userBookId when no userId', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      const result = await service.getBooks();

      expect(result).toEqual([
        {
          id: 1,
          title: 'Le Petit Prince',
          author: 'Antoine de Saint-Exupéry',
          cover: mockBook.cover,
          userBookId: null,
          status: null,
        },
      ]);
    });

    it('includes userBookId and status when userId provided and userBook exists', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([mockBookWithUserBook]);

      const result = await service.getBooks(99);

      expect(result[0].userBookId).toBe(42);
      expect(result[0].status).toBe('READ');
    });

    it('returns empty array when no books exist', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([]);

      const result = await service.getBooks();

      expect(result).toEqual([]);
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the book when found', async () => {
      const fullBook = { ...mockBook, comments: [], rates: [] };
      mockPrismaService.book.findUnique.mockResolvedValue(fullBook);

      const result = await service.findOne(1);

      expect(result).toEqual(fullBook);
      expect(mockPrismaService.book.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('throws an error when book not found', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Livre non trouvé');
    });
  });

  // ─── getRandomBooks ────────────────────────────────────────────────────────

  describe('getRandomBooks', () => {
    it('returns 10 random mapped books', async () => {
      mockPrismaService.book.count.mockResolvedValue(100);
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      const result = await service.getRandomBooks(10);

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
      expect(result[0].userBookId).toBeNull();
    });
  });

  // ─── getMostPopularBooks ───────────────────────────────────────────────────

  describe('getMostPopularBooks', () => {
    it('queries books ordered by averageRating desc', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      await service.getMostPopularBooks(10);

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { averageRating: 'desc' } }),
      );
    });
  });

  // ─── getLatestBooks ────────────────────────────────────────────────────────

  describe('getLatestBooks', () => {
    it('queries books ordered by publishing_date desc', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      await service.getLatestBooks(10);

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { publishing_date: 'desc' } }),
      );
    });
  });

  // ─── mostAddedBooks ────────────────────────────────────────────────────────

  describe('mostAddedBooks', () => {
    it('returns books enriched with addedCount', async () => {
      mockPrismaService.userBook.groupBy.mockResolvedValue([
        { bookId: 1, _count: { bookId: 5 } },
      ]);
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      const result = await service.mostAddedBooks(10);

      expect(result[0].addedCount).toBe(5);
      expect(result[0].id).toBe(1);
    });

    it('defaults to take=10', async () => {
      mockPrismaService.userBook.groupBy.mockResolvedValue([]);
      mockPrismaService.book.findMany.mockResolvedValue([]);

      await service.mostAddedBooks();

      expect(mockPrismaService.userBook.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });
  });

  // ─── mostCommentedBooks ────────────────────────────────────────────────────

  describe('mostCommentedBooks', () => {
    it('returns books enriched with commentCount', async () => {
      mockCommentService.numbeOfCommentsPerBook.mockResolvedValue([
        { bookId: 1, _count: { bookId: 3 } },
      ]);
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      const result = await service.mostCommentedBooks(10);

      expect(result[0].commentCount).toBe(3);
    });
  });

  // ─── searchBooks ───────────────────────────────────────────────────────────

  describe('searchBooks', () => {
    it('searches by title, author or isbn', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([mockBook]);

      const result = await service.searchBooks('prince');

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'prince', mode: 'insensitive' } },
              { author: { contains: 'prince', mode: 'insensitive' } },
              { isbn: { contains: 'prince', mode: 'insensitive' } },
            ],
          },
        }),
      );
      expect(result).toEqual([mockBook]);
    });

    it('applies pagination correctly', async () => {
      mockPrismaService.book.findMany.mockResolvedValue([]);

      await service.searchBooks('test', 3, 5);

      expect(mockPrismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });
  });

  // ─── searchBooksWithOpenLibraryApi ─────────────────────────────────────────

  describe('searchBooksWithOpenLibraryApi', () => {
    it('throws NotFoundException when query is shorter than 3 chars', async () => {
      await expect(service.searchBooksWithOpenLibraryApi('ab')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns filtered docs from OpenLibrary API', async () => {
      const mockDocs = [
        { title: 'Book A', edition_key: ['OL1M'] },
        { title: 'Book B', edition_key: [] }, // should be filtered out
      ];
      mockHttpService.get.mockReturnValue(of({ data: { docs: mockDocs } }));

      const result = await service.searchBooksWithOpenLibraryApi('prince');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Book A');
    });

    it('caps limit to 50', async () => {
      mockHttpService.get.mockReturnValue(of({ data: { docs: [] } }));

      await service.searchBooksWithOpenLibraryApi('tolkien', 100);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const calledUrl: string = mockHttpService.get.mock.calls[0][0];
      expect(calledUrl).toContain('limit=50');
    });
  });
});
