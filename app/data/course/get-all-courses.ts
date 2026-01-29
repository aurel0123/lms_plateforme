import { prisma } from "@/lib/db";

export async function getAllCourses () {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await prisma.course.findMany({
        where : { status : "Published"},
        orderBy : {
            createdAt : "desc"
        },
        select : {
            id : true ,
            title : true , 
            description : true , 
            smalldescription : true , 
            category : true , 
            duration : true , 
            level : true , 
            fileKey : true , 
            slug : true 
        }
    })

    return data ; 
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[number]; 