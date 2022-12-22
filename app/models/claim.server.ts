import type { Claim, ClaimRole, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { getUser, requireUserId } from "~/session.server";
import { DANGER, PermissionError } from "~/utils";
import { hasOrgAdminAcces } from "./organization.server";

export enum CLAIM_ROLES {
  Adjuster = "adjuster",
}

async function permitClaimPermissions(
  claimId: Claim["id"],
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
  const role = await prisma.claimRole.findFirst({
    where: {
      claimId,
      userId,
      role: {
        in: [CLAIM_ROLES.Adjuster],
      },
    },
  });
  if (role !== null) {
    return true;
  }
  const claim = await getClaimById(claimId);
  if (claim === null) {
    return false;
  }
  return hasOrgAdminAcces(claim.organizationId, request, override_permissions);
}

export async function getClaimById(id: Claim["id"]): Promise<Claim | null> {
  return prisma.claim.findUnique({ where: { id } });
}

export async function addUserToClaim(
  claimId: Claim["id"],
  userId: User["id"],
  role: CLAIM_ROLES,
  request?: Request,
  override_permissions?: DANGER
): Promise<ClaimRole> {
  if (!(await permitClaimPermissions(claimId, request, override_permissions))) {
    throw new PermissionError(
      //TODO: Populate permission errors with the name of someone who COULD.
      "You need to be an admin or an adjuster to change this claim. Contact the admin."
    );
  }
  return prisma.claimRole.create({
    data: {
      claimId,
      userId,
      role,
    },
  });
}

/*
    List all the claim summary details in the current user's organization.
*/
export async function listClaims(request: Request) {
  const user = await getUser(request);
  const allClaimsInOrg = await prisma.claim.findMany({
    where: { organizationId: user?.organizationId },
  });
  return allClaimsInOrg;
}

/*
    List all the claim summary details in an organization.
    Requires permission override if the current user doesn't belong to that organization.
*/
export async function listClaimsInOrganization(
  organizationId?: string,
  request?: Request,
  override_permissions?: DANGER
) {}
