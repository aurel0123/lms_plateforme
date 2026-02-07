import "server-only";
import { prisma } from "@/lib/db";
import { RequireAdmin } from "./require-admin";

export async function getRecentCourses() {
  await RequireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
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
    },
  });

  return data;
}
