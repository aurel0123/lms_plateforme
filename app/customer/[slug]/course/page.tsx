import { GetCourseSidebar } from '@/app/data/course/get-course-sidebar-data'
import { redirect } from 'next/navigation'
import React from 'react'

interface AppProps {
  params : Promise<{slug : string}>
}

export default async function PageSlugRoute({params} : AppProps) {
  const {slug} = await params
  const course = await GetCourseSidebar(slug)
  const firstChapter = course.course.chapters[0]
  const firstlesson = firstChapter.lessons[0]
  if(firstlesson){
    redirect(`/customer/${slug}/course/${firstlesson.id}`)
  }
  return (
    <div className='flex flex-col items-center justify-center h-full text-center'>
      <h2 className='mb-2 font-bold text-2xl'>Aucune lecons disponible</h2>
      <p className='text-muted-foreground'>
        Ce cours n&apos;a pas encore de lecons.
      </p>
    </div>
  )
}
