export const dynamic = "force-dynamic";
import { getAllCourses } from '@/app/data/course/get-all-courses'
import React, { Suspense } from 'react'
import PublicCourseCard, { PublicCourseSkeleton } from '../_components/public-course-card';

export default function page() {
  return (
    <div className='mt-5'>
      <div className='flex flex-col space-y-2 mt-10'>
        <h1 className='text-3xl md:4xl font-bold tracking-tight'>
          Explorer les cours
        </h1>
        <p className='text-muted-foreground '>
          Découvrez notre large gamme de cours 
          conçus pour vous aider à atteindre vos objectifs d&apos;apprentissage
        </p>
      </div>
      <Suspense fallback={<PublicCourseCardLayoutSkeleton/>}>
        <RenderState />
      </Suspense>
    </div>
  )
}


async function RenderState(){
  const courses = await getAllCourses(); 
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
      {
        courses.map((course) =>(
          <PublicCourseCard key={course.id} data = {course}/>
        ))
      }
    </div>
  )
}

function PublicCourseCardLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
      {Array.from(({length : 5})).map((_, index) => (
        <PublicCourseSkeleton key={index}/>
      ))}
    </div>
  );
}
