/*
  Warnings:

  - Added the required column `description` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "position" INTEGER NOT NULL;
