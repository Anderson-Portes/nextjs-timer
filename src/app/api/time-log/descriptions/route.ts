import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });
  const descriptions = await prisma.timeLog.findMany({
    select: {
      description: true,
    },
    distinct: ["description"],
    where: {
      userId: token?.sub,
      description: { not: null },
    },
  });
  const formattedDescriptions = descriptions.map(({ description }) => ({
    label: description,
    value: description,
  }));
  return NextResponse.json(formattedDescriptions);
};
