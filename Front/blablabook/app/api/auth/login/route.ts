import { signIn } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 },
      );
    }

    // Appel au backend
    // const response = await fetch(`${apiBaseUrl}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });

    // if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({}));
    //   const message =
    //     errorData?.message || "Identifiants incorrects. Veuillez réessayer.";
    //   return NextResponse.json({ error: message }, { status: 401 });
    // }

    // const data = await response.json();
    // if (!data?.user) {
    //   return NextResponse.json(
    //     { error: "Erreur lors de la connexion" },
    //     { status: 401 },
    //   );
    // }

    // Créer la session avec NextAuth
   await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
