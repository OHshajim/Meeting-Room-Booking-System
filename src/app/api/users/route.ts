import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch users with optional email filtering
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  try {
    const users = await prisma.user.findMany({
      where: email ? { email: { contains: email, mode: "insensitive" } } : {},
      select: {
        id: true,
        email: true,
        role: true,
        bookings: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}