"use client";

import { useState, useEffect } from "react";
import {
  addToLibrary,
  removeFromLibrary,
  checkIfBookInLibrary,
} from "@/lib/actions/userbook.action";

interface LibraryButtonProps {
  userId?: number;
  bookId: number;
  token: string | null;
  initialUserBookId?: number | null;
  className?: string;
  onUpdate?: (userBookId: number | null) => void;
  onToast?: (message: string, type: "success" | "error") => void;
}

export default function LibraryButton({
  userId,
  bookId,
  token,
  initialUserBookId = null,
  className = "",
  onUpdate,
  onToast,
}: LibraryButtonProps) {
  const [userBookId, setUserBookId] = useState<number | null>(
    () => initialUserBookId ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si le livre est dans la librairie du user
  useEffect(() => {
    if (!userId || initialUserBookId !== null) {
      return;
    }
    
    const checkBook = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      const result = await checkIfBookInLibrary(userId, bookId, token);
      if (result.success && result.userBook) {
        setUserBookId(result.userBook.id);
      }
      setIsLoading(false);
    };

    checkBook();
  }, [userId, bookId, initialUserBookId, token]);

  //! Ajouter
  const handleAdd = async () => {
    console.log("Handle add to library", bookId, userId, token);
    if (!token || !userId) {
      onToast?.("Veuillez vous connecter pour ajouter des livres", "error");
      return;
    }
    const result = await addToLibrary(bookId, userId, token);
    if (result.success) {
      const newId = result.data?.id || null;
      setUserBookId(newId);
      onUpdate?.(newId);
      onToast?.(result?.message ?? "Livre ajouté avec succès", "success");
    } else {
      onToast?.(result.error ?? "Une erreur est survenue", "error");
    }
  };

  //! Retirer
  const handleRemove = async () => {
    if (!token || !userBookId) return;
    const result = await removeFromLibrary(userBookId, token);
    if (result.success) {
      setUserBookId(null);
      onUpdate?.(null);
      onToast?.(result?.message ?? "Livre retiré avec succès", "success");
    } else {
      onToast?.(result.error ?? "Une erreur est survenue", "error");
    }
  };

  //! Bouton CSS
  const baseBtn =
    "flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-[12px] font-normal rounded-2xl px-3 py-1 transition-colors truncate";

  if (isLoading) {
    return (
      <button
        disabled
        className={`${baseBtn} bg-gray-200 text-gray-500 cursor-wait ${className}`}
      >
        <span className="material-icons text-[14px]! animate-spin">
          hourglass_empty
        </span>
      </button>
    );
  }

  return (
    <>
      {userBookId ? (
        <button
          onClick={handleRemove}
          className={`${baseBtn} bg-orange-200 text-orange-800 hover:bg-orange-100 ${className}`}
        >
          <span className="material-icons text-[14px]!">bookmark_remove</span>
          <span className="hidden sm:inline">Retirer</span>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className={`${baseBtn} bg-green-200 text-green-800 hover:bg-green-100 ${className}`}
        >
          <span className="material-icons text-[14px]!">add</span>
          <span>Ajouter à ma bibliothèque</span>
        </button>
      )}
    </>
  );
}
