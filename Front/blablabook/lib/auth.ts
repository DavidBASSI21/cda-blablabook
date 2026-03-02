import { auth } from "@/auth.config";

export type User = {
  id: number;
  email: string;
  username: string;
  isPrivate: boolean;
  profilePicture: string | null;
  roleId: number | null;
};

export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

export async function getAuthUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user) return null;

  return {
    id: Number(session.user.id),
    email: session.user.email ?? "",
    username: session.user.username ?? "",
    isPrivate: session.user.isPrivate ?? false,
    profilePicture: session.user.profilePicture ?? null,
    roleId: session.user.roleId ?? null,
  };
}
