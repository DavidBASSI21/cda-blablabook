import { NextResponse } from "next/server";
import { auth } from "@/auth.config";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const token = session?.accessToken;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const commentId = Number(id);

  if (!Number.isFinite(commentId)) {
    return NextResponse.json(
      { message: `Invalid comment id: ${id}` },
      { status: 400 }
    );
  }

  const res = await fetch(`http://api:3000/comments/${commentId}/report`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}