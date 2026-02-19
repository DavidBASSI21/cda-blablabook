"use client";

import Image from "next/image";
import {
  DeleteUserAction,
  UpdateUserRoleAction,
} from "./BackofficeSwitchUserComment";
import { getUploadUrl } from "@/lib/utils";
import { User } from "@/lib/actions/backoffice.action";
import { Drawer } from "vaul";
import { useEffect, useRef, useState } from "react";
import { getUsers } from "@/lib/actions/backoffice.action";
import { useRouter } from "next/navigation";

// Fonction permettant d'appliquer un petit délai entre chaque saisie de caractères
// dans la barre de recherche afin de ne pas inonder la BDD de requêtes au fur et à mesure qu'on
// saisi du texte dans l'input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BackofficeUsersMobile({
  users: initialUsers,
  onUpdateUserRole,
  onDeleteUser,
  totalUserCount,
}: {
  users: User[];
  totalUserCount: number;
  onDeleteUser: DeleteUserAction;
  onUpdateUserRole: UpdateUserRoleAction;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialUsers.length < totalUserCount);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const observerRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  useEffect(() => {
    const resetAndSearch = async () => {
      // setLoading(true);
      const res = await getUsers(0, pageSize, debouncedSearch);
      // On remplace la liste des utilisateurs avec le résultat de la recherche :
      setUsers(res.data);
      // Reset de la page de résultat pour éviter toute erreur
      setPage(0);
      // Si le nombre d'utilisateurs affiché
      setHasMore(res.data.length < res.total);
      // setLoading(false);
    };

    if (debouncedSearch !== undefined) {
      resetAndSearch();
    }
  }, [debouncedSearch]);

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        // Si le marqueur (observerRef) devient visible à l'écran
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          const nextPage = page + 1;
          const res = await getUsers(nextPage, pageSize, debouncedSearch);
          // On ajoute les nouveaux utilisateurs à la suite des anciens
          setUsers((prev) => [...prev, ...res.data]);
          setPage(nextPage);
          // On vérifie si on a atteint le bout de la base de données
          setHasMore(users.length + res.data.length < res.total);
          setLoading(false);
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, page, debouncedSearch, users.length]);
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="px-2 py-3 sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="relative text-gray-400">
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher par pseudo ou email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 text-noir"
          />
        </div>
      </div>
      {users.map((user) => {
        const isAdmin = user.roleId === 1;

        const handleToggle = async () => {
          const newRoleId = isAdmin ? 2 : 1;

          const result = await onUpdateUserRole(user.id, newRoleId);

          // 2. Si succès, mettre à jour l'état local pour déclencher l'animation et le rendu
          if (result.success) {
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.id === user.id ? { ...u, roleId: newRoleId } : u,
              ),
            );
          } else {
            console.log(result.error || "Erreur lors du changement de rôle");
          }
        };
        const handleDelete = async () => {
          const result = await onDeleteUser(user.id);

          if (result.success) {
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
            router.refresh();
          } else {
            console.log(result.error || "Erreur lors de la suppression");
          }
        };
        return (
          <Drawer.Root key={user.id} shouldScaleBackground={false}>
            <Drawer.Trigger asChild>
              <div className="w-full border-b border-b-gray-200 flex items-center justify-between h-[90px] p-2.5 active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    {user.profilePicture ? (
                      <Image
                        src={getUploadUrl(user.profilePicture)}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        alt={user.username}
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
                      {user.username}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Inscrit le{" "}
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${isAdmin ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                  >
                    {isAdmin ? "Administrateur" : "Utilisateur"}
                  </span>
                </div>
              </div>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-50 antialiased">
                <div className="p-4 bg-white rounded-t-[10px] flex-1">
                  <div
                    aria-hidden
                    className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-8"
                  />

                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="font-medium mb-4 text-gray-900 flex justify-center">
                      {/* Avatar Section */}
                      <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                        {user.profilePicture ? (
                          <Image
                            src={getUploadUrl(user.profilePicture)}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            alt={user.username}
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
                          {user.username}
                        </p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-sm">
                          Dernière modification le{" "}
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${isAdmin ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        {isAdmin ? "Administrateur" : "Utilisateur"}
                      </span>
                    </div>

                    <div className="flex border-b border-b-gray-200 p-2.5 items-center justify-between py-6">
                      <div className="pr-4">
                        <p className="text-noir text-lg font-semibold leading-tight">
                          Droits d&apos;administration
                        </p>
                        <p className="text-gray-500 text-sm">
                          Peut gérer les utilisateurs et les paramètres
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          className={`toggle-btn ${isAdmin ? "toggled" : ""}`}
                          onClick={handleToggle}
                        >
                          <div className="thumb"></div>
                        </button>
                      </div>
                    </div>
                    <div className="flex p-2.5 items-center justify-between py-6">
                      <button
                        type="button"
                        className="text-red-800 flex gap-3 font-bold"
                        onClick={handleDelete}
                      >
                        <span className="material-symbols-rounded">
                          person_remove
                        </span>{" "}
                        Supprimer cet utilisateur
                      </button>
                    </div>
                  </div>
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
