import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getOrCreateStytchUser(
  stytchUserId: User["stytchUserId"],
  email?: User["email"]
) {
  const maybeUser = await prisma.user.findUnique({
    where: { stytchUserId },
  });
  if (maybeUser === null) {
    return await prisma.user.create({
      data: { stytchUserId, email: email ?? undefined },
    });
  }
  return maybeUser;
}

export async function deleteUserById(id: User["id"]) {
  return prisma.user.delete({ where: { id } });
}
