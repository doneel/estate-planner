import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getOrCreateStytchUser(
  stytchUserId: User["stytchUserId"],
  email: User["email"]
) {
  const maybeUser = await prisma.user.findUnique({
    where: { stytchUserId },
  });
  if (maybeUser === null) {
    return await prisma.user.create({ data: { stytchUserId, email } });
  }
  return maybeUser;
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      //password: true,
    },
  });

  if (!userWithPassword) {
    return null;
  }

  const isValid = false; //await bcrypt.compare(password);

  if (!isValid) {
    return null;
  }

  const { ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
