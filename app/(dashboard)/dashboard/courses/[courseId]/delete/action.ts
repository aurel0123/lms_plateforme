"use server";
import { RequireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    }),
  );

export async function AdminDeleteCourse(
  courseId: string,
): Promise<ApiResponse> {
  const session = await RequireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });

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

    if (!session || !session.user) {
      return {
        status: "error",
        message: "Utilisateur non authentifié",
      };
    }
    await prisma.course.delete({
      where: { id: courseId },
    });
    return {
      status: "success",
      message: "Cours supprimé avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la suppression",
    };
  }
}
