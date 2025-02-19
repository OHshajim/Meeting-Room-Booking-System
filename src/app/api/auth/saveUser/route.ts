import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let existingUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email: user.emailAddresses[0].emailAddress,
          clerkId: user.id,
        },
      });
    }

    return NextResponse.json(existingUser);
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
