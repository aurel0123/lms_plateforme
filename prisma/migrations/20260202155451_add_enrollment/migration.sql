/*
  Warnings:

  - A unique constraint covering the columns `[stripCustomId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_stripCustomId_key" ON "user"("stripCustomId");
