import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { bookings: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.role === "ADMIN") {
      // For ADMIN, fetch all bookings
      const bookings = await prisma.booking.findMany({
        include: {
          user: true,
          room: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(bookings, { status: 200 });
    } else {
      const bookings = await prisma.booking.findMany({
        where: { userId: dbUser.id },
        include: {
          user: true,
          room: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(bookings, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
