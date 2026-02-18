import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import { getUploadUrl } from "@/lib/utils";
import UserBookLibrary from "@/components/Profil/UserBookLibrary";
import { auth } from "@/auth.config";

type Params = Promise<{ id: string }> | { id: string };

export default async function Page({ params }: { params: Params }) {
  const session = await auth();
  const token = session?.accessToken ?? null;
  const currentUserId = session?.user ? Number(session.user.id) : null;

  // Await params to get the id
  const resolvedParams = await Promise.resolve(params);
  const profileUserId = Number(resolvedParams.id);

  // Fetch the user profile data
  let userData;
  let errorType: "not-found" | "private" | null = null;

  try {
    userData = await getProfileById(profileUserId);
  } catch (error: unknown) {
    // Check the error message to determine the type
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        errorType = "not-found";
      } else if (error.message === "PRIVATE") {
        errorType = "private";
      } else {
        throw error; // Re-throw unexpected errors
      }
    }
  }

  // Handle not found case
  if (errorType === "not-found") {
    notFound();
  }

  // Handle private profile case
  if (errorType === "private" || !userData) {
    return (
      <section className="wrapper py-8">
        <div className="bg-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-quater mb-4">Profil privé</h2>
          <p className="text-noir opacity-70">
            Ce profil est privé et ne peut pas être consulté.
          </p>
        </div>
      </section>
    );
  }

  const isOwnProfile = currentUserId === profileUserId;
  const profileImageSrc = userData.profilePicture
    ? getUploadUrl(userData.profilePicture)
    : "/default-avatar.webp";

  return (
    <>
      <section className="wrapper bg-white pb-10 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 my-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full overflow-hidden shadow-md">
              <Image
                src={profileImageSrc}
                alt="Profile Picture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="title-section text-quater text-lg sm:text-2xl">
              {isOwnProfile
                ? "Ma bibliothèque"
                : `Bibliothèque de ${userData.username}`}
            </h2>
          </div>

          {isOwnProfile && (
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <Link
                href={"/mon-profil/modifier"}
                className="btn-primary text-center flex-1 sm:flex-none"
              >
                Modifier mon profil
              </Link>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-4 mb-2 bg-gray-300/20 p-4 rounded-sm">
          <p className="text-noir text-xs sm:text-sm leading-relaxed">
            {userData.description ? userData.description : "Aucune description"}
          </p>
        </div>
      </section>

      <section className="wrapper">
        <UserBookLibrary
          initialUserBooks={userData.userBooks || []}
          token={token}
          userId={isOwnProfile ? currentUserId : null}
        />
      </section>
    </>
  );
}
