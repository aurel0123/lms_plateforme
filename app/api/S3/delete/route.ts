import 'server-only';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";
import { env } from '@/lib/env';
import { client } from '@/lib/S3Client';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { RequireAdmin } from '@/app/data/admin/require-admin';

const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            allow: [], // "allow none" will block all detected bots
        }),
    )
    .withRule(
        fixedWindow({
            mode : "LIVE",
            max: 5,
            window: "1m",
        })
    )
export async function DELETE( request : Request){
    const session = await RequireAdmin();
    try{
        const decision = await aj.protect(request, {fingerprint: session?.user.id as string});
        if (decision.isDenied()){
            return NextResponse.json({error : "Forbidden"} , {status : 403})
        }
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