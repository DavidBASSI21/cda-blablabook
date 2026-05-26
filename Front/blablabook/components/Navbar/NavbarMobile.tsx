"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { useRef } from "react";
import { User } from "@/lib/auth";
import { getUploadUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function NavbarMobile({
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
    { href: "/", label: "Accueil", icon: "home" },
    { href: "/rechercher", label: "Recherche", icon: "search" },
    {
      href: "/dernieres-critiques", label: "Dernières critiques", icon: "book",
    },
        ...(session?.user?.roleId === 1 ? [
      {href:"/administration", label:"Administration", icon:"dashboard"}
    ]: []),
  ];

  return (
    <nav className="bg-primary wrapper py-4">
      <ul ref={navRef} className="flex justify-between items-center gap-6">
        {links.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <li
              key={index}
              className={`relative overflow-hidden text-sm font-one py-2 px-4 rounded-md tracking-widest transition-all duration-500 ease-in-out transform ${
                isActive
                  ? "text-white shadow-primary/30 scale-105 bg-linear-to-t from-second to-transparent"
                  : "text-white"
              }`}
            >
              <Link
                href={link.href}
                className="flex flex-col gap-1 items-center"
              >
                {" "}
                <span className="material-icons">{link.icon}</span>
                {/* {link.label} */}
              </Link>
            </li>
          );
        })}
        <li className="relative overflow-hidden text-sm font-one py-2 px-4 rounded-md tracking-widest transition-all duration-500 ease-in-out transform text-white">
          <Link
            href={connected ? "/mon-profil" : "/se-connecter"}
            className="flex flex-col gap-1 items-center"
          >
            {connected && user?.profilePicture ? (
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white">
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
        </li>
      </ul>
    </nav>
  );
}
