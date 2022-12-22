/*
  Warnings:

  - Added the required column `organizationId` to the `Claimant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Claimant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Claimant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);
INSERT INTO "new_Claimant" ("email", "id", "name", "phone") SELECT "email", "id", "name", "phone" FROM "Claimant";
DROP TABLE "Claimant";
ALTER TABLE "new_Claimant" RENAME TO "Claimant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
