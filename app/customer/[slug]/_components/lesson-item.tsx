import { cn } from "@/lib/utils";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AppProps {
  lesson: {
    id: string;
    description: string | null;
    title: string;
    position: number;
  };
  slug: string;
  isActive: boolean;
  completed: boolean;
}

export default function LessonItem({ lesson, slug, isActive , completed }: AppProps) {
  return (
    <Link
      href={`/customer/${slug}/course/${lesson.id}`}
      className={cn(
        "w-full justify-start h-auto p-1.5 transition-all flex flex-1 text-sm text-muted-foreground",
        isActive && !completed && "text-primary",
      )}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="rounded-full flex items-center justify-center size-5 bg-green-600 dark:bg-green-400 ">
              <Check className={cn("size-2.5 text-white")} />
            </div>
          ) : (
            <div
              className={cn(
                "rounded-full flex items-center justify-center border-2 size-5",
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "border-muted-foreground/60",
              )}
            >
              <IconPlayerPlay
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p
            className={cn(
              "text-xs font-medium truncate",
              isActive ? "text-primary font-semibold" : "text-foreground",
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="text-[10px] font-medium dark:text-green-400 text-green-600">
              complète
            </p>
          )}
          {
            isActive && !completed && (
              <p className="text-[10px] font-medium text-primary">
                Récement regarder
              </p>
            )
          }
        </div>
      </div>
    </Link>
  );
}
