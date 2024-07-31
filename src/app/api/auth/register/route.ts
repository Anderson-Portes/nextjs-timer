import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashedPassword = hashSync(password, 10);
  await prisma.user.create({ data: { name, email, password: hashedPassword } });
  return NextResponse.json({ message: "User created" }, { status: 201 });
};
