/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stytchUserId" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "oauthProvider" TEXT NOT NULL,
    "oauthRefreshToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "oauthProvider", "oauthRefreshToken", "stytchUserId", "updatedAt") SELECT "createdAt", "email", "id", "oauthProvider", "oauthRefreshToken", "stytchUserId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_stytchUserId_key" ON "User"("stytchUserId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
