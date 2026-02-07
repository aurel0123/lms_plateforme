import { GetEnrollmentStats } from "@/app/data/admin/admin-get-enrollment";
import { getRecentCourses } from "@/app/data/admin/admin-get-recent-course";
import EmptyState from "@/components/general/EmptyState";
import { ChartBarInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, { AdminCourseCardSkelton } from "./courses/_components/admin-course-card";
import { Suspense } from "react";

export default async function Page() {
  const EnrollmentsData = await GetEnrollmentStats();
  return (
    <>
      <SectionCards />
      <ChartBarInteractive data={EnrollmentsData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Cours recents</h1>
          <Link
            href="/dashboard/courses/"
            className={buttonVariants({ variant: "outline" })}
          >
            Voir plus
          </Link>
        </div>
        <Suspense fallback={<RecentCourseCardLayoutSkelton />}>
          <RenderRecentCourse />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourse() {
  const courses = await getRecentCourses();

  if (courses.length === 0) {
    return (
      <EmptyState
        buttonText="Créer un nouveau cours"
        title="Vous n'avez créé aucun cours"
        description="Aucun cours disponible. Créez un cours pour voir les cours récents ici."
        link="/dashboard/courses/create"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {courses.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

export function RecentCourseCardLayoutSkelton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from(({length : 2})).map((_, index) => (
        <AdminCourseCardSkelton key={index}/>
      ))}
    </div>
  );
}