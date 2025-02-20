import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { roomIds } = await req.json();

    if (!roomIds || roomIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const favoriteRooms = await prisma.room.findMany({
      where: { id: { in: roomIds } },
    });

    return NextResponse.json(favoriteRooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorite rooms:", error);
    return NextResponse.json(
      { message: "Failed to fetch favorite rooms" },
      { status: 500 }
    );
  }
}
