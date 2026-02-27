import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarDesktop from "@/components/Navbar/NavbarDesktop";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/Providers/SessionProviderWrapper";
import { auth } from "@/auth.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blablabook - Partagez vos avis sur les livres",
  description:
    "Découvrez, partagez et discutez de vos lectures préférées sur Blablabook, la communauté dédiée aux passionnés de livres.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuth = !!session?.user;
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
         <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white! antialiased `}
      >
        <SessionProviderWrapper session={session}>
          <nav>
            <div className="w-full hidden sm:block">
              <NavbarDesktop isConnected={isAuth} />
            </div>
            <div className="sm:hidden fixed bottom-0 w-full z-40">
              <NavbarMobile isConnected={isAuth} />
            </div>
          </nav>
          <main className="w-full min-h-screen bg-white pb-20">{children}</main>
          <div className="w-full hidden sm:block">
            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
