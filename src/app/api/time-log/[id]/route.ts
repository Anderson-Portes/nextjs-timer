import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string | undefined } }
) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "Time log not found." });
  }
  await prisma.timeLog.delete({ where: { id } });
  return NextResponse.json({ message: "Time log deleted." });
};
