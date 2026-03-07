"use server";

const url = process.env.NEXT_PUBLIC_API_URL ?? "http://api:3000";

export const getRandomBooks = async (userId?: number | null) => {
  const fetchUrl = userId
    ? `${url}/books/fetch-random?userId=${userId}`
    : `${url}/books/fetch-random`;

  const res = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la récupération des livres",
      status: res.status,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    data: resData,
  };
};

export const getMostPopularBooks = async (userId?: number | null) => {
  const fetchUrl = userId
    ? `${url}/books/fetch-popular-books?userId=${userId}`
    : `${url}/books/fetch-popular-books`;
  const res = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la récupération des livres",
      status: res.status,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    data: resData,
  };
};

export const getLatestBooks = async (userId?: number | null) => {
  const fetchUrl = userId
    ? `${url}/books/fetch-latest?userId=${userId}`
    : `${url}/books/fetch-latest`;
  const res = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la récupération des livres",
      status: res.status,
    };
  }

  const resData = await res.json();

  return {
    success: true,
    data: resData,
  };
};

//! RÉCUPÉRER UN LIVRE PAR SON ID
export const getBookById = async (bookId: number) => {
  const res = await fetch(`${url}/books/${bookId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return {
      success: false,
      error:
        errorData.message ||
        "Un problème est survenu lors de la récupération du livre",
      status: res.status,
    };
  }
  const resData = await res.json();

  return {
    success: true,
    data: resData,
  };
};
