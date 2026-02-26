"use server";
import { z } from "zod";
import { editProfileSchema } from "../validator.schema";
import { auth } from "@/auth.config";

const url = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

//! GET USER BY ID
export const getUserById = async (userId: number) => {
  const res = await fetch(`${url}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  const userData = await res.json();

  return userData;
};

//! GET PROFILE BY ID (avec les userbooks et commentaires)
export const getProfileById = async (userId: number) => {
  const session = await auth();
  const token = session?.accessToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${url}/users/profil/${userId}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    if (res.status === 400) {
      throw new Error("NOT_FOUND");
    } else if (res.status === 403) {
      throw new Error("PRIVATE");
    } else {
      throw new Error("Failed to fetch profile data");
    }
  }

  const userData = await res.json();

  return userData;
};

//! UPDATE PROFILE ACTION
export const updateProfileAction = async (
  userId: number,
  data: z.infer<typeof editProfileSchema>,
  profilePictureFile?: File | null,
) => {
  try {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("isPrivate", data.isPrivate.toString());

    if (data.description) {
      formData.append("description", data.description);
    }

    // Si un nouveau fichier est fourni, l'ajouter
    if (profilePictureFile) {
      formData.append("profilePicture", profilePictureFile);
    } 
    else if (data.profilePicture) {
      // Sinon, garder l'URL existante
      formData.append("profilePicture", data.profilePicture);
    }

    const res = await fetch(`${url}/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // Ne pas définir Content-Type, le navigateur le fera automatiquement avec la boundary
      },
      body: formData,
    });

    if (!res.ok) {
      console.log("Error response from API:", res);
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.message || "Erreur lors de la mise à jour du profil",
        status: res.status,
      };
    }

    const resData = await res.json();

    return {
      success: true,
      data: resData,
      message: "Profil mis à jour avec succès",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
};
