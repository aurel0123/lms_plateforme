import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SkeletonLesson() {
  return (
    <div className="flex flex-col h-full pl-6">
      <div className="relative aspect-video rounded overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-6 flex-1 mt-4">
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-1/2 h-4" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-4/6 h-4" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-5/24 h-10" />
        </div>
      </div>
    </div>
  );
}
