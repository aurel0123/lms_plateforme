/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { EnrolledCoursesType } from "@/app/data/course/get-course-enrolled";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useContruct } from "@/hooks/use-contruct";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCoursesType;
}

export default function CustomerCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useContruct(data.course.fileKey);
  const {progressPercentage , lessonCompleted , totalLesson} = useCourseProgress({ CourseData: data.course as any });
  return (
    <Card className="relative group py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10 rounded">
        {data.course.level}
      </Badge>

      <Image
        src={thumbnailUrl ?? ""}
        alt="Thumbnail image"
        width={600}
        height={400}
        className="w-full h-full object-cover rounded-t-xl aspect-video"
      />

      <CardContent className="p-4">
        <Link
          href={`/customer/${data.course.slug}/course`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.course.title}
        </Link>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">
          {data.course.smalldescription}
        </p>
        <div className="space-y-4 mt-2">
          <div className="flex justify-between text-sm mb-1">
            <p>Progression : </p>
            <p>{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {lessonCompleted} sur {totalLesson} lecons complètés
          </p>
        </div>
         <Link
          href={`/customer/${data.course.slug}/course`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Demarer
        </Link>
      </CardContent>
    </Card>
  );
}