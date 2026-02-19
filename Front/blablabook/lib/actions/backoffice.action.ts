"use server";

import { auth } from "@/auth.config";
import { Session } from "next-auth";

export type User = {
  id: number;
  username: string;
  email: string;
  isPrivate: boolean;
  profilePicture: string | null;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: number;
  title: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  _count: {
    reports: number;
  };
};

const url = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

export const getUserCount = async () => {
  const session = await auth();
  const token = (session as Session)?.accessToken;
  if (!token) {
    return {
      success: false,
      error: "Non authentifié",
    };
  }
  const res = await fetch(`${url}/users/user-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { success: false, data: [] };
  const data = await res.json();
  return { success: true, data };
};

export const getCommentCount = async () => {
  const session = await auth();
  const token = (session as Session)?.accessToken;
  const res = await fetch(`${url}/comments/comment-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return { success: false, data: [] };
  const data = await res.json();
  return { success: true, data };
};

export const getReportedCommentCount = async () => {
  const session = await auth();
  const token = (session as Session)?.accessToken;
  if (!token) {
    return {
      success: false,
      error: "Non authentifié",
    };
  }
  const res = await fetch(`${url}/comments/reported-comment-count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { success: false, data: [] };
  const data = await res.json();
  return { success: true, data };
};

export const getBookReadCount = async () => {
  const res = await fetch(`${url}/userbook/book-read-count`, {
    method: "GET",
  });

  if (!res.ok) return { success: false, data: [] };
  const data = await res.json();
  return { success: true, data };
};

//! GET ALL USERS
export const getUsers = async (
  page: number,
  limit: number,
  search: string = "",
) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(
      `${url}/users?page=${page}&limit=${limit}&search=${search}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const usersData = await res.json();

    return usersData;
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
};

//! UPDATE USER ROLE
export const updateUserRole = async (userId: number, newRoleId: number) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(`${url}/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleId: newRoleId }),
    });
    if (!res.ok) {
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

//! REMOVE USER
export const removeUser = async (userId: number) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(`${url}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok)
      return {
        success: false,
        error: "Une erreur est survenue",
      };

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user : ", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de l'utilisateur",
    };
  }
};

// //! GET ALL COMMMENTS TO MODERATE
export const getAllCommentsToModerate = async (page: number, limit: number) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(
      `${url}/comments/comments-to-moderate?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok)
      return {
        success: false,
        error: "Une erreur est survenue",
      };

    const data = await res.json();
    console.log("Data from API:", data);
    return {
      success: true,
      data,
      total: data.length,
      message: "Récupération des critiques à modérer effectuée avec succès",
    };
    //   return data;
  } catch (error) {
    console.error("Error fetching comments to moderate : ", error);
    return {
      success: false,
      error:
        "Une erreur est survenue lors de la récupération des critiques à modérer",
    };
  }
};

//! APPROVE COMMENT
export const approveComment = async (commentId: number, newStatus: string) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(`${url}/comments/${commentId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error:
          errorData.message || "Erreur lors de l'approbation de la critique'",
        status: res.status,
      };
    }

    const resData = await res.json();

    return {
      success: true,
      data: resData,
      message: "Critique approuvée avec succès",
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'approbation de la critique'",
    };
  }
};

//! DISAPPROVE COMMENT
export const disapproveComment = async (
  commentId: number,
  newStatus: string,
) => {
  try {
    const session = await auth();
    const token = (session as Session)?.accessToken;
    if (!token) {
      return {
        success: false,
        error: "Non authentifié",
      };
    }
    const res = await fetch(`${url}/comments/${commentId}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error:
          errorData.message ||
          "Erreur lors de la désapprobation de la critique'",
        status: res.status,
      };
    }

    const resData = await res.json();

    return {
      success: true,
      data: resData,
      message: "Critique désapprouvée avec succès",
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    return {
      success: false,
      error:
        "Une erreur est survenue lors de la désapprobation de la critique'",
    };
  }
};
