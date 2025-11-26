"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, courseSchemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: [], // "allow none" will block all detected bots
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    })
  );

export async function editCourse(
  data: courseSchemaType,
  CourseId: string
): Promise<ApiResponse> {
  const user = await RequireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Vous avez trop de demandes. Veuillez réessayer plus tard.",
        };
      } else {
        return {
          status: "error",
          message: "Vous êtes un bot ou votre accès a été refusé.",
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Données invalides",
      };
    }

    await prisma.course.update({
      where: {
        id: CourseId,
        authorId: user.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Cours mis à jour avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la mise à jour du cours",
    };
  }
}
