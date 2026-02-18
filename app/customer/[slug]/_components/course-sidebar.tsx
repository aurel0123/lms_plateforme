"use client";
import { CourseSidebarType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { IconChevronDown, IconPlayerPlay } from "@tabler/icons-react";
import React from "react";
import LessonItem from "./lesson-item";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/useCourseProgress";

interface AppProps {
  course: CourseSidebarType["course"];
}

export default function CourseSideBar({ course }: AppProps) {
  const pathName = usePathname();
  const currentLessionId = pathName.split("/").pop();
  const {lessonCompleted , progressPercentage , totalLesson} = useCourseProgress({CourseData : course})
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full bg-primary/10 flex items-center justify-center shrink-0 size-10">
            <IconPlayerPlay className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate font-semibold text-base leading-tight ">
              {course.title}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground"> Progression</span>
            <span className="font-medium">{lessonCompleted}/{totalLesson} lecons</span>
          </div>
          <Progress value={55} className="h-1.5" />
          <p className="text-xs text-muted-foreground ">{progressPercentage}% de lecture</p>
        </div>
      </div>

      <div className="py-3 pr-2 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="h-auto flex ite gap-2 w-full"
              >
                <div className="shrink-0">
                  <IconChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold truncate text-foreground text-sm">
                    {chapter.position} : {chapter.title}
                  </p>
                  <p className="font-medium truncate text-muted-foreground text-[10px]">
                    {chapter.lessons.length} leçons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  lesson={lesson}
                  slug={course.slug}
                  key={lesson.id}
                  isActive={lesson.id === currentLessionId}
                  completed = {lesson.lessonProgress.find(
                    (progress) => progress.lessonId === lesson.id
                  )?.completed || false}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
