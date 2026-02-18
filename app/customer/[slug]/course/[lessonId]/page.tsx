import { getLessonContent } from "@/app/data/course/get-lesson-content";
import React, { Suspense } from "react";
import LessonContent from "./LessonContent";
import SkeletonLesson from "./_components/skeletonLesson";

interface AppProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default async function PageLesson({ params }: AppProps) {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<SkeletonLesson />}>
      <LoaderPageLesson lessonId={lessonId} />
    </Suspense> 
  );
}

async function LoaderPageLesson({ lessonId }: { lessonId: string }) {
  const lesson = await getLessonContent(lessonId);

  return <LessonContent data={lesson} />;
}
