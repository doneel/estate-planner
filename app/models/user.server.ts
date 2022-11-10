import type { User } from "@prisma/client";

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

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}
