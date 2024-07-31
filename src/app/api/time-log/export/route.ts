import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });
  const initialDate = req.nextUrl.searchParams.get("initialDate");
  const finalDate = req.nextUrl.searchParams.get("finalDate");
  const hoursUsed = await prisma.$queryRaw`
    SELECT description,sum((finishedAt - createdAt) / 3600000.0)  AS hours_used FROM TimeLog 
    WHERE userId = ${token?.sub} and DATE(createdAt / 1000,'unixepoch') between ${initialDate} and ${finalDate}`;
  return NextResponse.json(hoursUsed);
};
