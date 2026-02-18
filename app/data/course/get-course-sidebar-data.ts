import "server-only";
import { prisma } from "@/lib/db";
import { RequireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function GetCourseSidebar(slug: string) {
  const session = await RequireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      smalldescription: true,
      category: true,
      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress : {
                where: {
                  userId: session.id,
                },
                select: {
                  id : true , 
                  completed : true, 
                  lessonId : true ,
                }
              }
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return {
    course,
  };
}

export type CourseSidebarType = Awaited<ReturnType<typeof GetCourseSidebar>>;
