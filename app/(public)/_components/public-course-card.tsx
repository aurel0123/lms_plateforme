import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContruct } from "@/hooks/use-contruct";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface iAppProps {
  data: PublicCourseType;
}
export default function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useContruct(data.fileKey);
  return (
    <Card className="relative group py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10 rounded">
        {data.level}
      </Badge>

      <Image
        src={thumbnailUrl}
        alt="Thumbnail image"
        width={600}
        height={400}
        className="w-full h-full object-cover rounded-t-xl aspect-video"
      />

      <CardContent className="p-4">
        <Link
          href={`/explore-courses/${data.slug}`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">
          {data.smalldescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>

         <Link
          href={`/explore-courses/${data.slug}/`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          En savoir plus
        </Link>
      </CardContent>
    </Card>
  );
}


export function PublicCourseSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="relative w-full h-fit">
        <Skeleton className="h-[250] aspect-video w-full rounded-t-lg object-cover" />
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded"/>
        <Skeleton className="h-4 w-full mb-4 rounded"/>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-5">
            <Skeleton className="size-8 rounded-md"/>
            <Skeleton className="h-4 rounded w-10"/>
          </div>
          <div className="flex items-center gap-x-5">
            <Skeleton className="size-8 rounded-md"/>
            <Skeleton className="h-4 rounded w-10"/>
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded"/>
      </CardContent>
    </Card>
  );
}
