import 'server-only';

import { NextResponse } from "next/server";
import {z} from "zod"; 
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/lib/env';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client } from '@/lib/S3Client';


export const fileUploadSchema = z.object({
    fileName : z.string().min(1 , {message : "FileName is required"}), 
    contentType:z.string().min(1 , {message: "ContentType is require"}), 
    size: z.number().min(1 , {message : "Size is required"}), 
    isImage: z.boolean()
})

export async function POST(request : Request){
    try {
        const body = await  request.json(); 
        const validate = fileUploadSchema.safeParse(body)
        if(!validate.success){
            return NextResponse.json({error : "Invalid request Body"}) ;
        }
        const {fileName , contentType , size} = validate.data;

        const uniqueKey = `${uuidv4()}-${fileName}`;
        const commande = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES, 
            ContentType : contentType ,
            ContentLength : size ,  
            Key : uniqueKey
        })

        const presignedUrl = await getSignedUrl(client , commande , {
            expiresIn : 360 // URL EXPIRED IN 6 MINUTES
        })
        const response = {
            presignedUrl, 
            key : uniqueKey
        }

        return NextResponse.json(response); 
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json({
            error : "Failed presigned Url"
        }, {status:500}) ; 
    }
}