import EmptyState from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { geEnrolledCourses } from "../data/course/get-course-enrolled";
import PublicCourseCard from "../(public)/_components/public-course-card";
import CustomerCourseCard from "./_components/customer-course-card";

export default async function page() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    geEnrolledCourses(),
  ]);

  const enrolledCourseIds = enrolledCourses.map(({ course }) => course.id);

  // Cours où l'utilisateur EST inscrit
  const myEnrolledCourses = courses.filter((course) =>
    enrolledCourseIds.includes(course.id)
  );

  // Cours où l'utilisateur N'EST PAS inscrit
  const availableCourses = courses.filter(
    (course) => !enrolledCourseIds.includes(course.id)
  );
  return (
    <>
      {/* Section : Cours inscrits */}
      <div>
        <h1 className="text-3xl font-bold">Cours inscrits</h1>
        <p className="text-muted-foreground">
          Vous pouvez voir les cours dont vous avez accès
        </p>
      </div>

      {myEnrolledCourses.length === 0 ? (
        <EmptyState
          title="Pas de cours payé"
          link="/explore-courses"
          description="Vous n'avez pas encore payé de cours."
          buttonText="Liste des cours"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CustomerCourseCard key={course.course.id} data={course} />
          ))}
        </div>
      )}

      {/* Section : Cours disponibles */}
      <section className="mt-10">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Cours disponibles</h1>
          <p className="text-muted-foreground">
            Ici vous pouvez voir les cours disponibles
          </p>
        </div>

        {availableCourses.length === 0 ? (
          <div className="h-fit">
            <EmptyState
              title="Pas de cours disponible"
              link="/explore-courses"
              description="Aucun cours disponible."
              buttonText="Liste des cours"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {availableCourses.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}