"use server"

import { prisma } from "@/lib/db";
import { courseSchema, courseSchemaType } from "@/lib/zodSchema";
import { ApiResponse } from "@/lib/type";
import { RequireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { request } from "@arcjet/next";
import { stripe } from "@/lib/stripe";


const aj = arcjet
    .withRule(
        fixedWindow({
            mode : "LIVE",
            max: 5,
            window: "1m",
        })
    )

export async function CreateCourse(values: courseSchemaType ) : Promise<ApiResponse> {
    const session = await RequireAdmin();
    try{

        const req = await request();
        const decision = await aj.protect(req , {fingerprint: session.user.id});

        if (decision.isDenied()) {

            if(decision.reason.isRateLimit()){
                return {
                    status : "error",
                    message : "Vous avez trop de demandes. Veuillez réessayer plus tard."
                }
            }else {
                return {
                    status:"error",
                    message : "Vous êtes un bot ou votre accès a été refusé."
                }
            }
        }

        if (!session || !session.user) {
            return {
                status: "error",
                message: "Utilisateur non authentifié"
            };
        }

        const validation = courseSchema.safeParse(values);
        if(!validation.success){
            return {
                status : "error",
                message : "Forme de donnée invalide"
            }
        }
        const data = await stripe.products.create({
            name : validation.data.title,
            description : validation.data.smalldescription,
            default_price_data : {
                currency : "usd",
                unit_amount : validation.data.price * 100
            }
        })
        await prisma.course.create({
            data : {
                ...validation.data,
                authorId: session.user.id,
                stripePriceId : data.default_price as string
            },
        });
        return  {
            status : "success",
            message: "Cour crée avec succès"
        }
    }catch (error) {
        console.error("Erreur lors de la création du cours:", error);
        return {
            status: "error",
            message: "Erreur lors de la création du cours"
        };
    }
}
