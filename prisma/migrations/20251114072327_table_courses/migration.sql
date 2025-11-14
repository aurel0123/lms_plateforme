-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('Beginner', 'Intermedi', 'Advanced');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('Draft', 'Published', 'Archive');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "level" "CourseLevel" NOT NULL DEFAULT 'Beginner',
    "category" TEXT NOT NULL,
    "smalldescription" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'Draft',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
