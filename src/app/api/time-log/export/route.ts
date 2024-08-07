import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });
  const initialDateParam = req.nextUrl.searchParams.get("initialDate");
  const finalDateParam = req.nextUrl.searchParams.get("finalDate");
  const initialDate = initialDateParam ? new Date(initialDateParam) : new Date();
  const finalDate = finalDateParam ? new Date(finalDateParam) : new Date();
  const hoursUsed = await prisma.$queryRaw`
    SELECT description, sum("finishedAt" - "createdAt") AS hours_used FROM "TimeLog" 
    WHERE "userId" = ${token?.sub} and "createdAt"::date between ${initialDate} and ${finalDate} group by description
  `;
  return NextResponse.json(hoursUsed);
};
