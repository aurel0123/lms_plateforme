"use server"
import { RequireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function makeLessonComplete(lessonId : string , slug : string) : Promise<ApiResponse> {
    const session = await RequireAdmin(); 

    try{
        await prisma.lessonProgres.upsert({
            where : {
                userId_lessonId : {
                    userId : session.user.id,
                    lessonId : lessonId
                }
            }, 
            update : {
                completed : true
            },
            create : {
                userId : session.user.id,
                lessonId : lessonId,
                completed : true
            }
        })
        revalidatePath(`/customer/${slug}`)
        return {
            status : "success",
            message : "Leçon complèté avec succès"
        }
    }catch {
        return {
            status : "error",
            message : "Something went wrong"
        }
    }
}