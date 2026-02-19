"use client";

import Image from "next/image";

import {
  Comment,
  getAllCommentsToModerate,
} from "@/lib/actions/backoffice.action";
import { Drawer } from "vaul";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUploadUrl } from "@/lib/utils";
import {
  ApproveCommentAction,
  DisapproveCommentAction,
} from "./BackofficeSwitchUserComment";

export default function BackofficeCommentsDrawerMobile({
  commentsToModerate = [],
  onApproveComment,
  onDisapproveComment,
  totalCommentsToModerateCount,
}: {
  commentsToModerate: Comment[];
  totalCommentsToModerateCount: number;
  onApproveComment: ApproveCommentAction;
  onDisapproveComment: DisapproveCommentAction;
}) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(commentsToModerate);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    commentsToModerate.length < totalCommentsToModerateCount,
  );

  const observerRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        // Si le marqueur (observerRef) devient visible à l'écran
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          const nextPage = page + 1;
          const res = await getAllCommentsToModerate(nextPage, pageSize);
          // On ajoute les nouveaux commentaires à la suite des anciens
          setComments((prev) => [...prev, ...res.data]);
          setPage(nextPage);
          // On vérifie si on a atteint le bout de la base de données
          setHasMore(comments.length + res.data.length < res.data);
          setLoading(false);
        }
      },
      { threshold: 0.5 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, comments.length]);
  return (
    <div className="w-full flex flex-col gap-2">
      {totalCommentsToModerateCount === 0 && (
        <div className="bg-blue-100 rounded-md px-4 py-2 flex items-center gap-2 mt-4 justify-center shadow-sm">
          <p className="text-slate-700 font-medium">
            Aucune critique à modérer pour le moment
          </p>
          <span className="material-symbols-rounded text-slate-700">
            task_alt
          </span>
        </div>
      )}
      {comments.map((commentToModerate) => {
        const handleDisapproveComment = async () => {
          const result = await onDisapproveComment(
            commentToModerate.id,
            "HIDDEN",
          );
          if (result.success) {
            setComments((prevComments) =>
              prevComments.filter((c) => c.id !== commentToModerate.id),
            );
            router.refresh();
          } else {
            console.log(
              result.error || "Erreur lors du masquage de la critique",
            );
          }
        };

        const handleApproveComment = async () => {
          const result = await onApproveComment(
            commentToModerate.id,
            "APPROVED",
          );
          if (result.success) {
            setComments((prevComments) =>
              prevComments.filter((c) => c.id !== commentToModerate.id),
            );
            router.refresh();
          } else {
            console.log(
              result.error || "Erreur lors de l'approbation de la critique",
            );
          }
        };
        return (
          <Drawer.Root key={commentToModerate.id} shouldScaleBackground={false}>
            <Drawer.Trigger asChild>
              <div className="w-full border-b border-b-gray-200 flex items-center justify-between h-[90px] p-2.5 active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    {commentToModerate.user.profilePicture ? (
                      <Image
                        src={getUploadUrl(
                          commentToModerate.user.profilePicture,
                        )}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        alt={commentToModerate.user.username}
                      />
                    ) : (
                      <div className="bg-blue-300 w-full h-full flex items-center justify-center">
                        <span className="material-symbols-rounded text-blue-950">
                          hide_image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-noir text-lg font-semibold leading-tight">
                      {commentToModerate.user.username}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {commentToModerate.user.email}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="rounded-full flex items-center gap-2 justify-center px-2 py-1 text-s font-medium bg-orange-100 text-orange-800">
                    {commentToModerate._count.reports}{" "}
                    <span className="material-symbols-rounded">report</span>
                  </span>
                </div>
              </div>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[85%] fixed bottom-0 left-0 right-0 outline-none z-50 antialiased">
                <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 my-4" />

                {/* Zone scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="flex flex-col gap-4">
                      {/* Section Avatar centrée */}
                      <div className="flex justify-center w-full">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-300">
                          {commentToModerate.user.profilePicture ? (
                            <Image
                              src={getUploadUrl(
                                commentToModerate.user.profilePicture,
                              )}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              alt={commentToModerate.user.username}
                            />
                          ) : (
                            <span className="material-symbols-rounded text-blue-950 text-5xl flex items-center justify-center h-full">
                              person
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start justify-between w-full px-1">
                        <div className="flex flex-col">
                          <Drawer.Title className="text-xl font-bold text-noir leading-none">
                            {commentToModerate.user.username}
                          </Drawer.Title>
                          <p className="text-gray-400 text-sm mt-1">
                            {commentToModerate.user.email}
                          </p>
                        </div>

                        <div className="rounded-full flex items-center gap-2 justify-center px-2 py-1 text-s font-medium bg-orange-100 text-orange-800">
                          <span className="rounded-full flex items-center gap-2 justify-center px-2 py-1 text-s font-medium bg-orange-100 text-orange-800">
                            {commentToModerate._count.reports}{" "}
                            <span className="material-symbols-rounded">
                              report
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    <div className="space-y-2">
                      <h4 className="font-bold text-lg text-noir">
                        {commentToModerate.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {commentToModerate.content}
                      </p>
                    </div>

                    {/* On ajoute un peu d'espace en bas pour ne pas que le texte soit caché par les boutons */}
                    <div className="h-24" />
                  </div>
                </div>

                {/* Actions : Fixées en bas du Drawer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center gap-8 pb-8">
                  <button
                    onClick={handleDisapproveComment}
                    className="h-14 w-14 flex justify-center items-center rounded-full text-white bg-gradient-to-b from-red-400 to-rose-500 shadow-lg active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-rounded text-2xl">
                      chat_bubble_off
                    </span>
                  </button>

                  <button
                    onClick={handleApproveComment}
                    className="h-14 w-14 flex justify-center items-center rounded-full text-white bg-gradient-to-b from-green-400 to-emerald-500 shadow-lg active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-rounded text-2xl">
                      mark_chat_read
                    </span>
                  </button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        );
      })}

      <div ref={observerRef} className="h-[50px]"></div>
    </div>
  );
}
