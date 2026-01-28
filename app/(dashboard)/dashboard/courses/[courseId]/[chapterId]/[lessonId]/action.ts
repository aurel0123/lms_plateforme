"use server"
import { RequireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchema";

export async function UpdateLesson(values : lessonSchemaType , lessonId : string): Promise<ApiResponse>{
    await RequireAdmin(); 
    try{
        const validate = lessonSchema.safeParse(values)
        if(!validate.success){
            return {
                status : "error",
                message : "Erreur de validation des champs"
            }
        }

        await prisma.lesson.update({
            where : { id : lessonId},
            data : {
                title : validate.data.title,
                description : validate.data.description,
                videoUrl : validate.data.videoUrl, 
                thumbnailkey : validate.data.thumbnailkey
            }
        })
        return {
            status : "success", 
            message : "Lesson modifié avec succès "
        }
    }catch {
        return {
            status : "error",
            message : "Erreur lors de la modification"
        }
    }
}