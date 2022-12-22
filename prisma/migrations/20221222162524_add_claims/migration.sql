-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file_number" TEXT,
    "claim_number" TEXT,
    "name" TEXT,
    "claimant_id" TEXT,
    "carrier_id" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Claim_claimant_id_fkey" FOREIGN KEY ("claimant_id") REFERENCES "Claimant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Claim_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "Carrier" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Claimant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT
);
