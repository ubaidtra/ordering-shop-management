import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    return NextResponse.json({ adminExists: !!admin });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json({ adminExists: false });
  }
}

