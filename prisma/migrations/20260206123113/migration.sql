/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "stripePriceId" TEXT NOT NULL DEFAULT 'azertyuiopqsdfghjklmwxcvbn';

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripePriceId_key" ON "Course"("stripePriceId");
