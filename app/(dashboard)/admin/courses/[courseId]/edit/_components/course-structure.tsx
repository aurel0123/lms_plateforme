"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
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
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";

interface CourseStructureProps {
  data : AdminCourseSingularType
}

interface SortableItemProps {
  id: string;
  children: (listeners : DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?:{
    type : "chapter" | "lesson";
  chapterId? : string;
  }
}
export default function CourseStructure({data} : CourseStructureProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [items, setItems] = useState(
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
    })) || []
  );

  if (!data || !data.chapters) {
    return <div>Impossible de charger le cours.</div>
  }

  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleChapterOpen(chapterId: string) {
    setItems(
      items.map((chapter) => 
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    )
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
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem 
                key={item.id}
                id={item.id}
                data={{type : "chapter"}}
              >
                {
                  (listeners) => (
                    <Card>
                      <Collapsible open={item.isOpen}
                        onOpenChange={() => toggleChapterOpen(item.id)}
                      >
                        <div className="flex items-center justify-between p-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" {...listeners} className="cursor-grab opacity-60 hover:opacity-100">
                              <GripVertical className="size-4"/>
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="mr-2 flex items-center">
                                {item.isOpen ? <ChevronDown className="size-4"/> :  <ChevronRight className="size-4"/>}
                              </Button>
                            </CollapsibleTrigger>
                            <p className="font-medium hover:text-primary cursor-pointer">
                              {item.title}
                            </p>
                          </div>

                          <Button variant="outline" size="sm">
                            <Trash2 className="size-4"/>
                          </Button>
                        </div>
                        <CollapsibleContent>
                          <div className="p-1">
                            <SortableContext items={item.lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>
                              {item.lessons.map((lesson) => ((
                                <SortableItem
                                  key={lesson.id}
                                  id={lesson.id}
                                  data={{type : "lesson", chapterId : item.id}}
                                >
                                  {
                                    (listeners) => (
                                      <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent rounded-sm">
                                        <div className="flex items-center gap-2">
                                          <Button variant="ghost" size="icon" {...listeners}>
                                            <GripVertical className="size-4"/>
                                          </Button>
                                          <FileText className="size-4"/>
                                          <Link href={`admin/course/${data.id}/${item.id}/${lesson.id}`} className="hover:text-primary">
                                            {lesson.title}
                                          </Link>
                                        </div>
                                        <Button variant="outline" size="sm">
                                          <Trash2 className="size-4"/>
                                        </Button> 
                                      </div>
                                    )
                                  }
                                </SortableItem>
                              )))}
                            </SortableContext>
                            <div>
                              <Button variant="outline" className="w-full mt-2">
                                Ajouter une leçon
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )
                }
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

function SortableItem({id , children , className , data} : SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: id , data : data});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn("touch-none", className , isDragging ? "z-10" : "")}>
      {children(listeners)}
    </div>
  );
}
