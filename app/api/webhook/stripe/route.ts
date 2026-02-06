import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export const runtime = "nodejs";
export async function POST(req : Request) {
    const body = await req.text() ; 

    const headList = await headers(); 
    const signature = headList.get('Stripe-Signature') as string ; 
    
    let event : Stripe.Event ; 

    try {
        event = stripe.webhooks.constructEvent(
            body , 
            signature , 
            env.STRIPE_WEBHOOK_SECRET
        )
    } catch  {
        return new Response("Webhook error" , {status : 400})
    }

    const session = event.data.object as Stripe.Checkout.Session ; 

    if(event.type === 'checkout.session.completed') {
        const courseId = session.metadata?.courseId ; 
        const customId = session.customer as string ; 

        if(!courseId) {
            throw new Error("Ce cour est introuvable"); 
        }

        const user = await prisma
        .user
        .findUnique({
            where : {
                stripCustomerId : customId
            }
        })

        if(!user) {
            throw new Error("L'utilisateur est introuvable"); 
        }

        await prisma.enrollment.update({
            where : {
                id : session.metadata?.enrollmentId as string
            },
            data : {
                status : "Active", 
                userId : user.id , 
                courseId : courseId , 
                amount  : session.amount_total as number 
            }
        })
    }

    return new Response(null , {status : 200})
}