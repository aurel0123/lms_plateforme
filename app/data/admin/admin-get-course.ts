import { prisma } from "@/lib/db";
import { RequireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async  function adminGetCourse(id : string) {
    await RequireAdmin();
    const data = await prisma.course.findUnique({
        where:{
            id: id,
        },
        select:{
            id: true,
            title: true,
            smalldescription: true,
            description: true,
            category: true,
            level: true,
            duration: true,
            fileKey: true,
            slug: true,
            status: true,
            price: true,
            chapters: {
                select:{
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select:{
                            id: true,
                            title: true,
                            description: true,
                            thumbnailkey: true,
                            videoUrl: true,
                            position: true,
                        }
                    }
                }
            }
        }
    })
    if(!data){
        return notFound();
    }
    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;