"use client";

import Image from "next/image";

import {  Comment, getAllCommentsToModerate,} from "@/lib/actions/backoffice.action";
import { Drawer } from "vaul";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUploadUrl } from "@/lib/utils";
import { ApproveCommentAction, DisapproveCommentAction } from "./BackofficeSwitchUserComment";


export default function BackofficeCommentsDrawerMobile({ commentsToModerate = [], onApproveComment, onDisapproveComment, totalCommentsToModerateCount }: {
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
          // On ajoute les nouveaux utilisateurs à la suite des anciens
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
      {comments.map((commentToModerate) => {

        const handleDisapproveComment = async() => {
          const result = await onDisapproveComment(commentToModerate.id, "HIDDEN");
          console.log('ON REFUSE LA CRITIQUE ET ON LA MASQUE! ')
          if(result.success) {
            setComments((prevComments) => prevComments.filter((c) => c.id !== commentToModerate.id));
            router.refresh();
          } else {
            console.log(result.error || "Erreur lors du masquage de la critique");
          }
        }

        const handleApproveComment = async() => {
          const result = await onApproveComment(commentToModerate.id, "APPROVED");
          console.log("ON ACCEPTE LA CRITIQUE ET ELLE DISPARAIT !")
          if(result.success) {
            setComments((prevComments) => prevComments.filter((c) => c.id !== commentToModerate.id));
            router.refresh();
          } else {
            console.log(result.error || "Erreur lors de l'approbation de la critique");
          }
        }
        return (
          <Drawer.Root key={commentToModerate.id} shouldScaleBackground={false}>
            <Drawer.Trigger asChild>
              <div className="w-full border-b border-b-gray-200 flex items-center justify-between h-[90px] p-2.5 active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    {commentToModerate.user.profilePicture ? (
                      <Image
                        src={getUploadUrl(commentToModerate.user.profilePicture)}
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
                  <span className="rounded-full flex items-center gap-2 justify-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800">
                    Nb. signalements <span className="material-symbols-rounded">report</span>
                  </span>
                </div>
              </div>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50  " />
              <Drawer.Content className="bg-gray-100  overflow-y-scroll max-h-[50vh] flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-50 antialiased">
                <div className="p-4 bg-white rounded-t-[10px] flex-1">
                  <div aria-hidden className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-8"/>
                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="font-medium mb-4 text-gray-900 flex justify-center">
                      {/* Avatar Section */}
                      <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                        {commentToModerate.user.profilePicture ? (
                          <Image
                            src={getUploadUrl(commentToModerate.user.profilePicture)}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            alt={commentToModerate.user.username}
                          />
                        ) : (
                          <div className="bg-blue-300 w-full h-full flex items-center justify-center">
                            <span className="material-symbols-rounded text-blue-950 text-4xl">
                              hide_image
                            </span>
                          </div>
                        )}
                      </div>
                    </Drawer.Title>

                    <div className="flex border-b border-b-gray-200 p-2.5 items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-noir text-xl font-semibold leading-tight">
                          {commentToModerate.user.username}
                        </p>
                        <p className="text-gray-500 text-sm">{commentToModerate.user.email}</p>
                      </div>
                      <span
                        className="rounded-full px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 flex items-center"
                      >
                       Nb. signalements <span className="material-symbols-rounded">report</span>
                      </span>
                    </div>

                    <div className="flex border-b border-b-gray-200 p-2.5 items-center justify-between py-6">
                      <div className="pr-4">
                        <p className="text-noir text-lg font-semibold leading-tight">
                            {commentToModerate.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                            {commentToModerate.content}
                        </p>
                      </div>
                    </div>
                     <div className="flex p-2.5 items-center justify-center gap-12 py-6">
                        <button type="button" onClick={handleDisapproveComment} className="cursor-pointer h-16 w-16 flex justify-center items-center rounded-full text-white bg-linear-to-b from-red-400 to-rose-500 shadow-md active:scale-95 transition-transform">
                        <span className="w-9 h-9 material-symbols-rounded text-4xl text-[36px]!">chat_bubble_off</span> </button>
                         <button type="button" onClick={handleApproveComment} className="cursor-pointer h-16 w-16 flex justify-center items-center rounded-full text-white bg-linear-to-b from-green-400 to-emerald-300 shadow-md active:scale-95 transition-transform">
                        <span className="w-9 h-9 material-symbols-rounded text-4xl text-[36px]!">mark_chat_read</span> </button>
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        );
      })}

      <div ref={observerRef} className="h-[50px]">
      </div>
    </div>
  );
}