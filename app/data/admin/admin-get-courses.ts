import "server-only";
import { prisma } from "@/lib/db";
import { RequireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await new Promise((resolve) => setTimeout(resolve , 2000)); 
  await RequireAdmin();

  const data = await prisma.course.findMany({
    orderBy :{ createdAt: "desc" },
    select: {
        id: true,
        title: true,
        smalldescription: true,
        category: true,
        level: true,
        duration: true,
        fileKey: true,
        slug: true,
        status: true,
        price: true,

    }
  })
  return data;
}

export type AdminCoursesType = Awaited<ReturnType<typeof adminGetCourses>>[0];
