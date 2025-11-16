import 'server-only';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";
import { env } from '@/lib/env';
import { client } from '@/lib/S3Client';

export async function DELETE( request : Request){
    try{
        const body = await request.json(); 

        const key = body.key
        if(!key){
            return NextResponse.json({error : "Missing or invalid object key"} , {status : 400})
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key : key
        })

        await client.send(command);
        return NextResponse.json({message : "Image supprimer avec succès"} , {status : 200})
    }catch {
        return NextResponse.json({error : "Missing or invalid object key"} , {status : 400})
    }
}