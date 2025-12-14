import { adminGetCourse } from '@/app/data/admin/admin-get-course';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'; 
import EditCourseForm from './_components/edit-course-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CourseStructure from './_components/course-structure';

type Params = Promise<{courseId: string}>;

export default async function Edit({params} : {params : Params}) {
  const {courseId} = await params;

  const course = await adminGetCourse(courseId);
  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>
        Modifier : {" "}
        <span className='text-primary underline'>{course.title}</span>
      </h1>

      <Tabs defaultValue="basic-info" className='w-full'>
        <TabsList className='grid grid-cols-2 w-full'>
          <TabsTrigger value="basic-info">Information de Base</TabsTrigger>
          <TabsTrigger value="course-structure">Structure du cour</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>
                Information de Base
              </CardTitle>
              <CardDescription>
                Modifier les informations de base du cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={course}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>
                Structure du cour
              </CardTitle>
              <CardDescription>
                Modifier la structure du cour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={course}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
