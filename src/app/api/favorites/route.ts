import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { roomIds } = await req.json(); // Get favorite room IDs from the request

    if (!roomIds || roomIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty if no favorites
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
