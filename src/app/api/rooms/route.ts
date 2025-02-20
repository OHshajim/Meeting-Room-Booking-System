import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const capacity = searchParams.get("capacity");
  const amenities = searchParams.get("amenities");

  const filters: any = {};

  if (capacity) {
    filters.capacity = Number(capacity);
  }

  if (amenities) {
    filters.amenities = {
      equals: { [amenities]: true },
    };
  }
  try {
    const rooms = await prisma.room.findMany({ where: filters });

    return new Response(JSON.stringify(rooms), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const { name, capacity, amenities } = await req.json();
  const newRoom = await prisma.room.create({
    data: { name, capacity, amenities },
  });
  return new Response(JSON.stringify(newRoom), { status: 201 });
}
