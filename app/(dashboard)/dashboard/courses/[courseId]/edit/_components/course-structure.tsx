"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import React, { useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";
import NewChapterModal from "./newChapterModal";
import NewLessonsModal from "./newLessonsModal";
import DeleteLesson from "./deleteLesson";
import DeleteChapter from "./deleteChapter";

interface CourseStructureProps {
  data: AdminCourseSingularType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export default function CourseStructure({ data }: CourseStructureProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Stocke uniquement l'état ouvert/fermé de chaque chapitre
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  // Stocke les overrides de position issus du drag-and-drop optimiste
  const [chapterOrderOverride, setChapterOrderOverride] = useState<string[] | null>(null);
  const [lessonOrderOverride, setLessonOrderOverride] = useState<Record<string, string[]> | null>(null);

  // items est entièrement dérivé de data, avec les overrides appliqués
  const items = useMemo(() => {
    if (!data?.chapters) return [];

    let chapters = [...data.chapters].sort((a, b) => a.position - b.position);

    // Applique l'ordre optimiste des chapitres si présent
    if (chapterOrderOverride) {
      chapters = chapterOrderOverride
        .map((id) => chapters.find((c) => c.id === id))
        .filter(Boolean) as typeof chapters;
    }

    return chapters.map((chapter) => {
      let lessons = [...chapter.lessons].sort((a, b) => a.position - b.position);

      // Applique l'ordre optimiste des leçons si présent
      if (lessonOrderOverride?.[chapter.id]) {
        lessons = lessonOrderOverride[chapter.id]
          .map((id) => lessons.find((l) => l.id === id))
          .filter(Boolean) as typeof lessons;
      }

      return {
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: openChapters[chapter.id] ?? true,
        lessons: lessons.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.title,
          order: index + 1,
        })),
      };
    });
  }, [data, openChapters, chapterOrderOverride, lessonOrderOverride]);

  if (!data || !data.chapters) {
    return <div>Impossible de charger le cours.</div>;
  }

  function toggleChapterOpen(chapterId: string) {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !(prev[chapterId] ?? true),
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId: string | null = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Impossible de determiner le chapitre à réorganiser");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Impossible de trouver l'ancien/nouveau index pour la réorganisation");
        return;
      }

      const reorderedIds = arrayMove(items, oldIndex, newIndex).map((c) => c.id);
      const previousOverride = chapterOrderOverride;

      // Mise à jour optimiste
      setChapterOrderOverride(reorderedIds);

      const chaptersToUpdate = reorderedIds.map((id, index) => ({
        id,
        position: index + 1,
      }));

      const reorderPromise = async () => {
        const result = await reorderChapters(courseId, chaptersToUpdate);
        if (result.status !== "success") throw new Error(result.message);
        return result;
      };

      toast.promise(reorderPromise(), {
        loading: "Reorganisation des chapitres...",
        success: (result) => {
          // L'override sera écrasé par la revalidation de data
          setChapterOrderOverride(null);
          return result.message;
        },
        error: () => {
          setChapterOrderOverride(previousOverride);
          return "Echec de la reorganisation des chapitres";
        },
      });
    }

    if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current?.chapterId as string;
      const overChapterId = over.data.current?.chapterId as string;

      if (!activeChapterId || activeChapterId !== overChapterId) {
        toast.error("Impossible de déplacer une leçon entre différents chapitres");
        return;
      }

      const chapter = items.find((item) => item.id === activeChapterId);
      if (!chapter) {
        toast.error("Impossible de trouver le chapitre");
        return;
      }

      const oldIndex = chapter.lessons.findIndex((l) => l.id === activeId);
      const newIndex = chapter.lessons.findIndex((l) => l.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Impossible de trouver les index pour la réorganisation");
        return;
      }

      const reorderedLessonIds = arrayMove(chapter.lessons, oldIndex, newIndex).map((l) => l.id);
      const previousOverride = lessonOrderOverride;

      // Mise à jour optimiste
      setLessonOrderOverride((prev) => ({
        ...prev,
        [activeChapterId]: reorderedLessonIds,
      }));

      const lessonsToUpdate = reorderedLessonIds.map((id, index) => ({
        id,
        position: index + 1,
      }));

      const reorderPromise = async () => {
        const result = await reorderLessons(activeChapterId, lessonsToUpdate, courseId);
        if (result.status !== "success") throw new Error(result.message);
        return result;
      };

      toast.promise(reorderPromise(), {
        loading: "Reorganisation des leçons...",
        success: (result) => {
          setLessonOrderOverride(null);
          return result.message;
        },
        error: () => {
          setLessonOrderOverride(previousOverride);
          return "Echec de la reorganisation des leçons";
        },
      });
    }
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Chapitres</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>
        <CardContent className="space-y-4">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapterOpen(item.id)}
                    >
                      <div className="flex items-center justify-between p-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            {...listeners}
                            className="cursor-grab opacity-60 hover:opacity-100"
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mr-2 flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="font-medium hover:text-primary cursor-pointer">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapter chapterId={item.id} courseId={data.id} />
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(listeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...listeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/dashboard/courses/${data.id}/${item.id}/${lesson.id}`}
                                        className="hover:text-primary"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson
                                      courseId={data.id}
                                      lessonId={lesson.id}
                                      chapterId={item.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="mt-1">
                            <NewLessonsModal
                              courseId={data.id}
                              chapterId={item.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

function SortableItem({ id, children, className, data }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, data: data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-none", className, isDragging ? "z-10" : "")}
    >
      {children(listeners)}
    </div>
  );
}