/*
  Warnings:

  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stytchUserId" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "oauthProvider" TEXT NOT NULL,
    "oauthRefreshToken" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "oauthProvider", "oauthRefreshToken", "stytchUserId", "updatedAt") SELECT "createdAt", "email", "id", "oauthProvider", "oauthRefreshToken", "stytchUserId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_stytchUserId_key" ON "User"("stytchUserId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file_number" TEXT,
    "claim_number" TEXT,
    "name" TEXT,
    "claimantId" TEXT,
    "carrierId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Claim_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "Claimant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Claim_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE,
    CONSTRAINT "Claim_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_Claim" ("carrierId", "claim_number", "claimantId", "createdAt", "file_number", "id", "name", "receivedAt", "updatedAt") SELECT "carrierId", "claim_number", "claimantId", "createdAt", "file_number", "id", "name", "receivedAt", "updatedAt" FROM "Claim";
DROP TABLE "Claim";
ALTER TABLE "new_Claim" RENAME TO "Claim";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
