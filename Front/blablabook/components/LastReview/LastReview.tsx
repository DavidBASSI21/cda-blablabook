import ExpandableText from "@/components/ExpandableText";
import { getUploadUrl } from "@/lib/utils";
import Link from "next/dist/client/link";
import Image from "next/image";
import LibraryControls from "@/components/LastReview/LibraryControls";
import { auth } from "@/auth.config";

type Item = {
  id: number;
  title: string;
  content: string;
  date: string;
  book: { id: number; title: string; cover: string; author: string };
  user: {
    id: number;
    username: string;
    profilePicture: string | null;
  };
};

async function getLatest() {
  const res = await fetch("http://api:3000/comments/latest-per-book?take=9", {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}) ${text}`);
  }

  return res.json();
}

export default async function DernieresCritiques() {
  const items: Item[] = await getLatest();

  // ✅ session côté server
  const session = await auth();
  const token = session?.accessToken ?? null;
  const userId = session?.user ? Number(session.user.id) : null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto sm:py-14 space-y-6">
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Les dernières critiques
          </h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-10xl">
            Découvrez les dernières critiques de la communauté, accédez aux
            bibliothèques des autres membres et ajoutez directement des livres à
            votre bibliothèque.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {items.map((c) => (
            <article
              key={c.id}
              className="h-full flex flex-col rounded-md border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <Image
                  src={c.book.cover}
                  alt={c.book.title}
                  fill
                  className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-lg border"
                  loading="lazy"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-black truncate">
                    <Link
                      href={`/bibliotheque/${c.book.id}`}
                      className="hover:text-quater ml-1"
                    >
                      {c.book.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500">
                    de <span className="italic">{c.book.author}</span>
                  </p>

                  {token && userId && (
                    <div className="mt-2">
                      <LibraryControls
                        bookId={c.book.id}
                        token={token}
                        userId={userId}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  {c.title}
                </h3>

                <ExpandableText
                  text={c.content}
                  clampLines={4}
                  className="mt-2 text-sm text-gray-700 leading-relaxed"
                  minHeightClassName="min-h-[72px] sm:min-h-[96px]"
                />

                <div className="mt-auto pt-6 flex items-center gap-1 text-xs sm:text-sm text-gray-800">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    {c.user.profilePicture ? (
                      <Image
                        src={getUploadUrl(c.user.profilePicture)}
                        alt={c.user.username}
                        fill
                        className="rounded-full object-cover border"
                      />
                    ) : (
                      <span className="material-icons">account_circle</span>
                    )}
                  </div>

                  <span className="italic">
                    par{" "}
                    <Link
                      href={`/profil/${c.user.id}`}
                      className="underline hover:text-quater"
                    >
                      {c.user.username}
                    </Link>
                  </span>

                  <span className="italic">
                    le {new Date(c.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}