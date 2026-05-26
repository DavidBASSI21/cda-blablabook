"use client";

import { useState } from "react";
import LibraryButton from "@/components/Library/LibraryButton";
import StatusSelector from "@/components/Library/StatusSelector";

type ToastType = "success" | "error" | "info";

function showToast(message: string, type: ToastType) {
  console.log(`[${type}] ${message}`);
}

export default function LibraryControls({
                                          bookId,
                                          token,
                                          userId,
                                        }: {
  bookId: number;
  token: string;
  userId: number;
}) {
  const [currentUserBookId, setCurrentUserBookId] = useState<number | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  return (
    <div className="flex gap-2">
      <LibraryButton
        userId={userId}
        token={token}
        bookId={bookId}
        initialUserBookId={currentUserBookId}
        onUpdate={setCurrentUserBookId}
        onToast={(msg: string, type: ToastType) => showToast(msg, type)}
        className={"w-[50%] justify-center"}
      />

      {currentUserBookId && (
        <StatusSelector
          token={token}
          userBookId={currentUserBookId}
          status={currentStatus || "NOT_READ"}
          onUpdated={setCurrentStatus}
          onToast={(msg: string, type: ToastType) => showToast(msg, type)}
          triggerClassName="w-[50%] px-3 py-1 justify-center"
        />
      )}
    </div>
  );
}