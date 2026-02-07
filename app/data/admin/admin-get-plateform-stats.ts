import "server-only";

import { prisma } from "@/lib/db";
import { RequireAdmin } from "./require-admin";

export async function getPlatformStats() {
    await RequireAdmin();
  const [
    totalEnrollments,
    totalUsersEnrolled,
    totalCourses,
    totalLessons,
  ] = await Promise.all([
    prisma.enrollment.count(),

    prisma.enrollment.findMany({
      where: {
        userId: { not: null },
      },
      distinct: ["userId"],
      select: {
        userId: true,
      },
    }),

    prisma.course.count(),

    prisma.lesson.count(),
  ]);

  return {
    totalEnrollments,
    totalUsersEnrolled: totalUsersEnrolled.length,
    totalCourses,
    totalLessons,
  };
}
