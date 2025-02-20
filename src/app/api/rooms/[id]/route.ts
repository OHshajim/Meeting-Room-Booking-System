import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return new NextResponse("params.id is required", { status: 400 });

  const { name, capacity, amenities } = await req.json();
  console.log(name, capacity, amenities, params.id);

  const updatedRoom = await prisma.room.update({
    where: { id: String(params.id) },
    data: { name, capacity, amenities },
  });

  return new NextResponse(JSON.stringify(updatedRoom), { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) return new Response("params.id is required", { status: 400 });

  await prisma.room.delete({ where: { id: String(params.id) } });

  return new Response(null, { status: 204 });
}
