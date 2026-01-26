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
import React, { useEffect, useState } from "react";
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
  Trash2,
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
    })
  );
  const initItems =
    data?.chapters?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true, // only chapter level
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initItems);

  if (!data || !data.chapters) {
    return <div>Impossible de charger le cours.</div>;
  }
  useEffect(() => {
    setItems((prevItems)=> {
      const updatedItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true, // only chapter level
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })) ,
      })) || [] ;
      
      return updatedItems;
    })
  }, [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chaperId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Impossible de determiner le chapitre à réorganiser");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id == overId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error(
          "Impossible de trouver l'ancien/nouveau index pour la réorgansation"
        );
        return;
      }

      const reordedLocalChapter = arrayMove(items, oldIndex, newIndex);
      const updateChapterForState = reordedLocalChapter.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const previousItems = [...items];

      setItems(updateChapterForState);

      if (courseId) {
        const chaptersToUpdate = updateChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reoderChaptersPromise = async () => {
          const result = await reorderChapters(courseId, chaptersToUpdate);
          if (result.status !== "success") {
            throw new Error(result.message);
          }
          return result;
        };

        toast.promise(reoderChaptersPromise(), {
          loading: "Reorganisation des chapitres...",
          success: (result) => result.message,
          error: () => {
            setItems(previousItems);
            return "Echec de la reorganisation des chapitres";
          },
        });
      }
    }

    if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!activeChapterId || activeChapterId !== overChapterId) {
        toast.error(
          "Impossible de déplacer une leçon entre différents chapitres"
        );
        return;
      }

      const chapterIndex = items.findIndex(
        (item) => item.id === activeChapterId
      );
      if (chapterIndex === -1) {
        toast.error("Impossible de trouver le chapitre");
        return;
      }

      const chapterToUpdate = items[chapterIndex];
      const oldIndex = chapterToUpdate.lessons.findIndex(
        (item) => item.id === activeId
      );
      const newIndex = chapterToUpdate.lessons.findIndex(
        (item) => item.id == overId
      );

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Impossible de trouver les index pour la réorganisation");
        return;
      }

      const reordedLocalLesson = arrayMove(
        chapterToUpdate.lessons,
        oldIndex,
        newIndex
      );
      const updateLessonForState = reordedLocalLesson.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updateLessonForState,
      };
      const previousItems = [...items];

      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updateLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reoderLessonsPromise = async () => {
          const result = await reorderLessons(
            activeChapterId,
            lessonToUpdate,
            courseId
          );
          if (result.status !== "success") {
            throw new Error(result.message);
          }
          return result;
        };

        toast.promise(reoderLessonsPromise(), {
          loading: "Reorganisation des leçons...",
          success: (result) => result.message,
          error: () => {
            setItems(previousItems);
            return "Echec de la reorganisation des leçons";
          },
        });
      }
    }

    return;
  }

  function toggleChapterOpen(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
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
          <NewChapterModal courseId={data.id}/>
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

                        <DeleteChapter chapterId={item.id} courseId={data.id}/>
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
                                        href={`/dashboard/course/${data.id}/${item.id}/${lesson.id}`}
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
                            <NewLessonsModal courseId={data.id} chapterId={item.id}/>
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
