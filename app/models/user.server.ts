import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByStytchId(stytchUserId: User["stytchUserId"]) {
  return prisma.user.findUnique({ where: { stytchUserId } });
}

export async function createStytchUser({
  stytchUserId,
  email,
  oauthProvider,
  oauthRefreshToken,
}: Pick<
  User,
  "stytchUserId" | "email" | "oauthProvider" | "oauthRefreshToken"
>) {
  const maybeUser = await prisma.user.findUnique({
    where: { stytchUserId },
  });
  if (maybeUser === null) {
    return await prisma.user.create({
      data: { stytchUserId, email, oauthProvider, oauthRefreshToken },
    });
  }
  return maybeUser;
}

export async function deleteUserById(id: User["id"]) {
  return prisma.user.delete({ where: { id } });
}

export async function updateRefreshToken(
  id: User["id"],
  refreshToken: User["oauthRefreshToken"]
) {
  return prisma.user.update({
    data: { oauthRefreshToken: refreshToken },
    where: { id },
  });
}
