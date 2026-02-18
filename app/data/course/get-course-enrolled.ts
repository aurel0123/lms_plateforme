import "server-only";
import { prisma } from "@/lib/db";
import { RequireUser } from "../user/require-user";

export async function geEnrolledCourses() {
  const user = await RequireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          fileKey: true,
          level: true,
          duration: true,
          smalldescription: true,
          category : true, 
          chapters: {
            select: {
              id: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  lessonProgress : {
                    where : {
                      userId : user.id
                    }, 
                    select : {
                      id : true , 
                      completed : true, 
                      lessonId : true ,
                    }
                  }
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
}

export type EnrolledCoursesType = Awaited<ReturnType<typeof geEnrolledCourses>>[number];