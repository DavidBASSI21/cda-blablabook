/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import ExpandableText from "../ExpandableText";
import LibraryButton from "../Library/LibraryButton";
import StatusSelector, { StatusType } from "../Library/StatusSelector";
import { Toast, useToast } from "../Toast";
import Link from "next/dist/client/link";

interface SearchResultCardProps {
  book: {
    id: number;
    title: string;
    page_count: number;
    author: string;
    publishing_date: Date;
    summary: string;
    publisher: string;
    isbn: string;
    cover: string;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    userBooks?: {
      id: number;
      status: "READ" | "READING" | "NOT_READ";
      createdAt: Date;
      updatedAt: Date;
      userId: number;
      bookId: number;
    }[];
  };
  token: string | null;
  userId?: number;
}

export default function SearchResultCard({
  book,
  token,
  userId,
}: SearchResultCardProps) {
  const { toast, showToast, hideToast } = useToast();

  const userBookEntry = book.userBooks?.[0];
  const [currentUserBookId, setCurrentUserBookId] = useState<number | null>(
    userBookEntry?.id ?? null,
  );
  const [currentStatus, setCurrentStatus] = useState<StatusType>(
    (userBookEntry?.status ?? "NOT_READ") as StatusType,
  );

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={hideToast}
        />
      )}
      <article className="h-full flex flex-col rounded-md border bg-white p-5 shadow-sm hover:shadow-md transition">
        <div className="flex gap-4">
          <Link href={`/bibliotheque/${book.id}`}>
            <img
              src={book.cover}
              alt={book.title}
              className="w-32 sm:w-40 h-40 sm:h-48 object-cover rounded-lg border cursor-pointer"
              loading="lazy"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-black leading-tight truncate">
              {book.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              de <span className="italic">{book.author}</span>
            </p>

            <div className="mt-3 flex items-center gap-2">
              <LibraryButton
                userId={userId}
                bookId={book.id}
                token={token}
                initialUserBookId={currentUserBookId}
                onUpdate={setCurrentUserBookId}
                onToast={(msg, type) => showToast(msg, type)}
                className={currentUserBookId ? "text-xs" : "text-xs"}
              />
              {currentUserBookId && (
                <StatusSelector
                  token={token}
                  userBookId={currentUserBookId}
                  status={currentStatus}
                  onUpdated={setCurrentStatus}
                  onToast={(msg, type) => showToast(msg, type)}
                  triggerClassName="text-xs px-2 py-1"
                />
              )}
            </div>
          </div>
        </div>

        {/* <div className="mt-5 flex flex-col flex-1">
          <ExpandableText
            text={book.summary}
            clampLines={4}
            className="mt-2 text-sm text-gray-700 leading-relaxed"
            minHeightClassName="min-h-[72px] sm:min-h-[96px]"
          />
        </div> */}
      </article>
    </>
  );
}
