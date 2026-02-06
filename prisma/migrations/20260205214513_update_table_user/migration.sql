/*
  Warnings:

  - You are about to drop the column `stripCustomId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_stripCustomId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "stripCustomId",
ADD COLUMN     "stripCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_stripCustomerId_key" ON "user"("stripCustomerId");
