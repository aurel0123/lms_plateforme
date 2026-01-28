-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_courseId_fkey";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
