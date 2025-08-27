/*
  Warnings:

  - You are about to drop the column `phoneNumberVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "phoneNumberVerified",
ALTER COLUMN "role" DROP NOT NULL;
