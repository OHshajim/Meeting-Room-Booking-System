import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return new NextResponse("id is required", { status: 400 });

  const { name, capacity, amenities } = await req.json();

  const updatedRoom = await prisma.room.update({
    where: { id: String(id) },
    data: { name, capacity, amenities },
  });

  return new NextResponse(JSON.stringify(updatedRoom), { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return new NextResponse("id is required", { status: 400 });

  await prisma.room.delete({ where: { id: String(id) } });
  return new NextResponse(JSON.stringify({ message: "Deleted" }), {
    status: 200,
  });
}
