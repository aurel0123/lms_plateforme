"use server"
import { prisma } from "@/lib/db"
import { RequireAdmin } from "./require-admin"
import { notFound } from "next/navigation"


export async function AdminGetLesson( lessonId : string) {
    await RequireAdmin(); 

    const data = await prisma.lesson.findUnique({
        where : {
            id : lessonId
        }, 
        select : {
            id: true , 
            videoUrl : true , 
            thumbnailkey : true , 
            title : true ,
            position : true, 
            description : true
        }
    })

    if(!data){
        return notFound()
    }
    return data
}

export type AdminLessonType = Awaited<ReturnType<typeof AdminGetLesson>>;