import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import AdminCourseCard from './_components/admin-course-card';

export default async function Page() {
  const data = await adminGetCourses();
  return (
    <>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Vos Cours</h1>
            <Link href="/dashboard/courses/create/" className={buttonVariants()}>
                Créer votre cour
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {
              data.map((course) => (
                <AdminCourseCard key={course.id} data={course}/>
              ))
            }
        </div>
    </>
  )
}
