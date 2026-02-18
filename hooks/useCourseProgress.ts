import { CourseSidebarType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface AppProps {
  CourseData: CourseSidebarType["course"];
}
interface CourseProgressResult {
  totalLesson: number;
  lessonCompleted: number;
  progressPercentage: number;
}
export function useCourseProgress({
  CourseData,
}: AppProps): CourseProgressResult {
  return useMemo(() => {
    let totalLesson = 0;
    let lessonCompleted = 0;

    CourseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLesson++;

        // verifier q'une leçon est complete
        const isCompleted = lesson.lessonProgress.some(
          (progress) => lesson.id === progress.lessonId && progress.completed,
        );
        if (isCompleted) {
          lessonCompleted++;
        }
      });
    });

    const progressPercentage =
      totalLesson > 0
        ? Math.round((lessonCompleted / totalLesson) * 100)
        : 0;

    return {
      totalLesson,
      lessonCompleted,
      progressPercentage,
    };
  }, [CourseData]);
}
