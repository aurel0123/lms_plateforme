import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, { AdminCourseCardSkelton } from "./_components/admin-course-card";
import EmptyState from "@/components/general/EmptyState";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  const data = await adminGetCourses();
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vos Cours</h1>
        <Link href="/dashboard/courses/create/" className={buttonVariants()}>
          Créer votre cour
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardLayoutSkelton />}>
        <RenderState />
      </Suspense>
    </>
  );
}

async function RenderState() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length == 0 ? (
        <EmptyState
          title="Aucun cour trouvé"
          description="veuillez créer un cour pour commencer"
          buttonText="Créer un nouveau cour"
          link="/dashboard/courses/create/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardLayoutSkelton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from(({length : 5})).map((_, index) => (
        <AdminCourseCardSkelton key={index}/>
      ))}
    </div>
  );
}
