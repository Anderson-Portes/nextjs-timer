import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });
  const initialDateParam = req.nextUrl.searchParams.get("initialDate");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();
  initialDate.setHours(0, 0, 0, 0);
  const finalDateParam = req.nextUrl.searchParams.get("finalDate");
  const finalDate = finalDateParam
    ? new Date(finalDateParam)
    : new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        initialDate.getDate() + 1
      );
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      userId: token?.sub,
      createdAt: {
        gte: initialDate,
        lt: finalDate,
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(timeLogs);
};

export const POST = async (req: NextRequest) => {
  const token = await getToken({ req });
  const todayLastUserLog = await prisma.timeLog.findFirst({
    where: {
      userId: token?.sub,
      finishedAt: null,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  const { description } = await req.json();
  const newTimeLog = await (!todayLastUserLog
    ? prisma.timeLog.create({ data: { userId: token?.sub || "", description } })
    : prisma.timeLog.update({
        where: { id: todayLastUserLog.id },
        data: { finishedAt: new Date() },
      }));
  return NextResponse.json(newTimeLog);
};
