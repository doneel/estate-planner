/*
  Warnings:

  - You are about to drop the column `carrier_id` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `claimant_id` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `carrierId` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ClaimRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "ClaimRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClaimRole_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file_number" TEXT,
    "claim_number" TEXT,
    "name" TEXT,
    "claimantId" TEXT,
    "carrierId" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Claim_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "Claimant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Claim_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_Claim" ("claim_number", "createdAt", "file_number", "id", "name", "receivedAt", "updatedAt") SELECT "claim_number", "createdAt", "file_number", "id", "name", "receivedAt", "updatedAt" FROM "Claim";
DROP TABLE "Claim";
ALTER TABLE "new_Claim" RENAME TO "Claim";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
