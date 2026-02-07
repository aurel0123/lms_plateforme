import "server-only";
import { prisma } from "@/lib/db";
import { RequireAdmin } from "./require-admin";

export async function GetEnrollmentStats() {
  await RequireAdmin();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const last30Days : {date : string , enrollments : number}[]  = []

  for(let i= 29 ; i >= 0 ; i--){
    const date = new Date();
    date.setDate(date.getDate() - i);

    last30Days.push({
        date : date.toISOString().split("T")[0],
        enrollments : 0
    })
  }

  enrollments.forEach((enrollment)=> {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const index = last30Days.findIndex((day)=> day.date === enrollmentDate);
    if(index !== -1){
      last30Days[index].enrollments++;
    }
  })

  return last30Days;
}
