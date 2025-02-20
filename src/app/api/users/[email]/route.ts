import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params } : {params : any}
) {
  const { email } = await params;
  if (!email) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { email: email } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
