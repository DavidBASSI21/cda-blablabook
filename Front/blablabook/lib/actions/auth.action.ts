"use server";
import { z } from "zod";
import { registerSchema } from "../validator.schema";

//! REGISTER ACTION
const url = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
  const res = await fetch(`${url}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message || "Un problème est survenu lors de l'inscription",
      status: res.status,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    data: resData,
    message: "Inscription réussie",
  };
};
