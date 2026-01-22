import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";

/* =======================
   GET – fetch quiz history OR single attempt
   ======================= */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // 🔹 SINGLE ATTEMPT (DETAIL PAGE)
  if (id) {
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attempt);
  }

  // 🔹 ALL ATTEMPTS (HISTORY PAGE)
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(attempts);
}

/* =======================
   POST – save quiz attempt
   ======================= */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      title: body.title,
      mode: body.mode,
      score: body.score,
      total: body.total,
      data: body.data,
    },
  });

  return NextResponse.json(attempt);
}

/* =======================
   DELETE – delete quiz attempt(s)
   ======================= */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const ids: string[] = body.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "No IDs provided" },
      { status: 400 }
    );
  }

  await prisma.quizAttempt.deleteMany({
    where: {
      id: { in: ids },
      userId: session.user.id, // 🔒 user isolation
    },
  });

  return NextResponse.json({ success: true });
}