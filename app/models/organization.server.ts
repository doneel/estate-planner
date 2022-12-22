import type { Organization } from "@prisma/client";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import { DANGER } from "~/utils";
import { getUserById } from "./user.server";

export enum OrganizationRole {
  Admin = "admin",
}

export async function permitOrganizationAccess(
  organizationId: Organization["id"],
  request?: Request,
  override_permissions?: DANGER
): Promise<boolean> {
  if (override_permissions === DANGER.DANGEROUS) {
    return true;
  }
  if (request === undefined) {
    return false;
  }

  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  if (user === null) {
    throw new Error("User not found");
  }
  return user.organizationId === organizationId;
}

export async function hasOrgAdminAcces(
  organizationId: Organization["id"],
  request?: Request,
  override_permissions?: DANGER
): Promise<boolean> {
  if (override_permissions === DANGER.DANGEROUS) {
    return true;
  }
  if (request === undefined) {
    return false;
  }

  const userId = await requireUserId(request);
  const adminRole = await prisma.organizationRole.findFirst({
    where: { organizationId, userId, role: OrganizationRole.Admin },
  });
  return adminRole !== null;
}

export async function getOrCreateOrganizationForEmail(
  email: string
): Promise<[Organization, boolean]> {
  const domain = email.substring(email.indexOf("@") + 1);
  const org = await prisma.organization.findUnique({ where: { domain } });
  if (org !== null) {
    console.log(`Found org ${org.name} with domain ${domain}`);
    return [org, false];
  }
  const new_org = await prisma.organization.create({
    data: { name: domain, domain },
  });
  console.log(`Created new organization for domain ${domain}`);
  return [new_org, true];
}
