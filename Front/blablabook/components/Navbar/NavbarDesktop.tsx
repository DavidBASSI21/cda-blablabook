"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { User } from "@/lib/auth";
import { getUploadUrl } from "@/lib/utils";
import SearchBarHandler from "../Search/SearchBarHandler";
import { useSession } from "next-auth/react";

export default function NavbarDesktop({
  isConnected,
}: {
  isConnected: boolean;
}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLUListElement>(null);
  const { data: session } = useSession();

  const connected = !!session?.user || isConnected;
  const user: User | null = session?.user
    ? {
        id: Number(session.user.id),
        email: session.user.email ?? "",
        username: session.user.username ?? "",
        isPrivate: session.user.isPrivate ?? false,
        profilePicture: session.user.profilePicture ?? null,
        roleId: session.user.roleId ?? null,
      }
    : null;

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/dernieres-critiques", label: "Dernières critiques" },
    ...(session?.user?.roleId === 1 ? [
      {href:"/administration", label:"Administration"}
    ]: [])
  ];


  return (
    <nav className="w-full flex justify-between items-center gap-2 md:gap-4 py-4 wrapper bg-white">
      {" "}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <Image
            src="/logo/icon_logo_bleu.png"
            alt="Logo"
            width={50}
            height={50}
            className="shrink-0"
          />
        </Link>
        <div className="min-w-0 mr-2 flex-1">
          <SearchBarHandler />
        </div>
      </div>
      <ul ref={navRef} className="flex gap-2 md:gap-4 xl:gap-8 shrink-0">
        {links.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <li
              key={index}
              className={`relative overflow-hidden text-sm font-one py-2 px-2 xl:px-4 rounded-md tracking-widest transition-all duration-300 ease-out ${
                isActive
                  ? "text-quater underline underline-offset-4"
                  : "text-quater  hover:bg-quater/10 hover:underline hover:underline-offset-4"
              }`}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          );
        })}

        <Link
          href={connected ? "/mon-profil" : "/se-connecter"}
          className="flex items-center gap-2 text-quater hover:text-primary cursor-pointer transition-colors duration-300"
        >
          {connected && user?.profilePicture ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-quater">
              <Image
                src={getUploadUrl(user.profilePicture)}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <span className="material-icons">account_circle</span>
          )}
        </Link>
      </ul>
    </nav>
  );
}
