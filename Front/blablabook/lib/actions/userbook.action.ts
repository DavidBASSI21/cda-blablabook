"use server";

const url = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

//! RECUPERER LA LIBRAIRIE D'UN UTILISATEUR
//unused commented out in the backend for now
export const getUserLibrary = async (userId: number, token: string) => {
  const res = await fetch(`${url}/userbook/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { success: false, data: [] };
  const data = await res.json();
  return { success: true, data };
};

//! AJOUTER A LA LIBRAIRIE
export const addToLibrary = async (
  bookId: number,
  userId: number,
  token: string,
) => {
  const res = await fetch(`${url}/userbook/add/${userId}/${bookId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de l'enregistrement dans la bibliothèque",
      status: res.status,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    data: resData,
    message: "Élément enregistré avec succès",
  };
};

//! SUPPRIMER DE LA LIBRAIRIE
export const removeFromLibrary = async (id: number, token: string) => {
  const res = await fetch(`${url}/userbook/remove/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la suppression de l'élément de la bibliothèque",
      status: res.status,
    };
  }

  return {
    success: true,
    message: "Élément retiré avec succès",
  };
};

//! CHANGER LE STATUT
export const updateUserBookStatus = async (
  id: number,
  status: string,
  token: string,
) => {
  const res = await fetch(`${url}/userbook/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la mise à jour du statut",
      status: res.status,
    };
  }
  const resData = await res.json();
  return {
    success: true,
    data: resData,
    message: "Statut mis à jour avec succès",
  };
};

//! VÉRIFIER SI UN LIVRE EST DANS LA BIBLIOTHÈQUE DE L'UTILISATEUR
export const checkIfBookInLibrary = async (userId: number, bookId: number, token: string) => {
  const res = await fetch(`${url}/userbook/check/${userId}/${bookId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return {
      success: false,
      exists: false,
      userBook: null,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    exists: resData.exists,
    userBook: resData.userBook,
  };
};
