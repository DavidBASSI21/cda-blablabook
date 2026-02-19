"use client";

import { useState } from "react";

export default function DialogForCommentCellTable({
  content,
}: {
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className="max-w-[300px] truncate cursor-pointer hover:text-violet-500 transition-colors italic text-sm"
        onClick={() => setIsOpen(true)}
      >
        {content}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)} // Ferme au clic sur l'overlay
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur le contenu
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Contenu du commentaire
              </h3>
            </div>

            <div className="max-h-[60vh] overflow-y-auto text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              {content}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
