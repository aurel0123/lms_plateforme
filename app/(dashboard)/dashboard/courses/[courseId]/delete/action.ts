"use server"
import { RequireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";

export async function AdminDeleteCourse(courseId : string): Promise<ApiResponse>{
    await RequireAdmin(); 

    try{
        await prisma.course.delete({
            where : {id : courseId}
        })
        return {
            status : "success", 
            message : "Cours supprimé avec succès"
        }
    } catch {
        return {
            status : "error", 
            message : "Erreur lors de la suppression"
        }
    }
}