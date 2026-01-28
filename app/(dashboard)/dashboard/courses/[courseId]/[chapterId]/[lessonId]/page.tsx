import { AdminGetLesson } from '@/app/data/admin/admin-get-lesson';
import React from 'react'
import LessonForm from './_component/LessonForm';

type Params = Promise<{
    courseId : string , 
    chapterId : string , 
    lessonId : string
}>

export default async function page({params} : {params : Params}) {
  const {courseId , chapterId , lessonId} = await params; 

  const lesson = await AdminGetLesson(lessonId); 
  return (
    <LessonForm data={lesson} chapterId={chapterId} courseId={courseId}/>
  )
}
