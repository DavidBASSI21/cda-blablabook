import LogoutBtn from "@/components/Auth/LogoutBtn";
import React from "react";
import { redirect } from "next/navigation";
import { getProfileById } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import { getUploadUrl } from "@/lib/utils";
import UserBookLibrary from "@/components/Profil/UserBookLibrary";
import { auth } from "@/auth.config";

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/se-connecter");
  }

  const userId = Number(session.user.id);
  const accessToken = session.accessToken ?? null;
  const userData = await getProfileById(userId);
  const profileImageSrc = userData.profilePicture
    ? getUploadUrl(userData.profilePicture)
    : "/default-avatar.webp";

  return (
    <>
      <section className="wrapper bg-white pb-10 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 my-6">
          {/* Profile Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/30 to-second/30 blur-sm"></div>
              <div className="relative h-full w-full rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                <Image
                  src={profileImageSrc}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="title-section text-quater text-lg sm:text-2xl">
                Ma bibliothèque
              </h2>
            </div>
          </div>

          {/* Actions */}
          <div className="flex col gap-2 sm:gap-3">
            <Link
              href={"/mon-profil/modifier"}
              title="Modifier mon profil"
              className="w-full sm:w-fit group relative px-4 py-1.5 sm:py-2.5 bg-linear-to-r from-quater to-quater/90 text-white rounded-md hover:shadow-md hover:scale-105 active:scale-100 transition-all duration-200 text-center text-xs font-one tracking-widest overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="material-icons text-[10px] sm:text-[15px]">
                  edit
                </span>
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <LogoutBtn />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 mb-2 bg-linear-to-br from-primary/10 to-second/10 p-4 sm:p-5 rounded-xl border border-black/5">
          <p className="text-noir/90 text-xs sm:text-sm leading-relaxed font-one tracking-wide">
            {userData.description ? userData.description : "Aucune description"}
          </p>
        </div>
      </section>

      <section className="wrapper">
        <UserBookLibrary
          initialUserBooks={userData.userBooks || []}
          token={accessToken}
          userId={userId}
        />
      </section>
    </>
  );
}
