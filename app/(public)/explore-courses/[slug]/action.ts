"use server";
import { RequireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 3,
    window: "1m",
  }),
);
export async function enrollInCourseAction(
  courseId: string,
): Promise<ApiResponse | never> {
  const user = await RequireUser();

  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.id });
    if(decision.isDenied()){
        return {
            status : "error", 
            message : "Vous avez été bloqué"
        }
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        stripePriceId: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Le cour n'existe pas",
      };
    }
    const userWithStripeCustomId = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripCustomerId: true,
      },
    });

    let stripeCustomId: string;
    if (userWithStripeCustomId?.stripCustomerId) {
      stripeCustomId = userWithStripeCustomId.stripCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          UserId: user.id,
        },
      });

      stripeCustomId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripCustomerId: stripeCustomId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "Vous avez déjà acheter ce cour",
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            courseId: course.id,
            userId: user.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomId,
        line_items: [
          {
            price: course.stripePriceId as string,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });
      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Erreur du système de paiement. Veuillez ressayer plus tard",
      };
    }
    return {
      status: "error",
      message: "Erreur lors de l'enrollement",
    };
  }

  redirect(checkoutUrl);
}
