import React from 'react'
import CourseSideBar from './_components/course-sidebar'
import { GetCourseSidebar } from '@/app/data/course/get-course-sidebar-data';

interface AppProps {
  children: React.ReactNode, 
  params : Promise<{slug : string}>
}
export default async function layout({children , params} : AppProps) {

  const {slug} = await params ; 

  const course = await GetCourseSidebar(slug); 


  return (
    <div className="flex flex-1">
        <div className='w-80 border-r shrink-0 borer-border'>
            <CourseSideBar course={course.course}/>
        </div>
        <div className='flex-1 overflow-hidden'>
            {children}
        </div>
    </div>
  )
}
