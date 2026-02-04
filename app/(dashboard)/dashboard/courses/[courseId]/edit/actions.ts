"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import {
  chapterSchema,
  chapterSchemaType,
  courseSchema,
  courseSchemaType,
  lessonSchema,
  lessonSchemaType,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    }),
  );

export async function editCourse(
  data: courseSchemaType,
  CourseId: string,
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

export async function reorderLessons(
  chpaterId: string,
  lessons: {
    id: string;
    position: number;
  }[],
  courseId: string,
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "Aucune leçon fournie",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chpaterId,
        },
        data: {
          position: lesson.position,
        },
      }),
    );

    await prisma.$transaction(updates);
    revalidatePath(`/dashboard/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Leçons réorganisées avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la réorganisation des leçons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: {
    id: string;
    position: number;
  }[],
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "Aucun chapitre fourni",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      }),
    );

    await prisma.$transaction(updates);
    revalidatePath(`/dashboard/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapitres réorganisés avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la réorganisation des chapitres",
    };
  }
}

export async function createChapter(
  values: chapterSchemaType,
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const validate = chapterSchema.safeParse(values);

    if (!validate.success) {
      return {
        status: "error",
        message: "Erreur de la validation des champs ",
      };
    }

    //Transaction iteractive les requetes depends les uns des autres
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: validate.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: validate.data.title,
          courseId: validate.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/dashboard/courses/${validate.data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapitre créer avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la création",
    };
  }
}

export async function createLesson(
  values: lessonSchemaType,
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const validate = lessonSchema.safeParse(values);

    if (!validate.success) {
      return {
        status: "error",
        message: "Erreur de la validation des champs ",
      };
    }

    //Transaction iteractive les requetes depends les uns des autres
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: validate.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: validate.data.title,
          chapterId: validate.data.chapterId,
          description: validate.data.description,
          videoUrl: validate.data.videoUrl,
          thumbnailkey: validate.data.thumbnailkey,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/dashboard/courses/${validate.data.courseId}/edit`);
    return {
      status: "success",
      message: "lesson créer avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la création",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const chapterWithLesson = await prisma.chapter.findUnique({
      where : {
        id : chapterId
      }, 
      select : {
        lessons : {
          orderBy : {
            position : "asc"
          }, 
          select : {
            id: true , 
            position : true
          }
        }
      }
    })
    if(!chapterWithLesson) {
      return {
        status : "error",
        message : "Chapitre non trouvé"
      }
    }

    const lessons = chapterWithLesson.lessons
    
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId)

    if(!lessonToDelete) {
      return {
        status : "error", 
        message : "La lesson n'existe pas dans ce chapitre"
      }
    }
    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId)

    const updates = remainingLessons.map((lesson , index) => {
      return prisma.lesson.update({
        where : {
          id : lesson.id
        }, 
        data: { position : index + 1 }
      })
    })
    
    await prisma.$transaction([
      ...updates,
        prisma.lesson.delete({
        where : {
          id: lessonId,
          chapterId : chapterId
        }
      }),
    ])
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lesson supprimer avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la suppression ",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const CourseWithChapter = await prisma.course.findUnique({
      where : {
        id : courseId
      }, 
      select : {
        chapters : {
          orderBy : {
            position : "asc"
          }, 
          select : {
            id: true , 
            position : true
          }
        }
      }
    })
    if(!CourseWithChapter) {
      return {
        status : "error",
        message : "Cours non trouvé"
      }
    }

    const chapters = CourseWithChapter.chapters
    
    const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId)

    if(!chapterToDelete) {
      return {
        status : "error", 
        message : "Le chapitre n'existe pas dans ce cours"
      }
    }
    const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId)

    const updates = remainingChapters.map((chapter , index) => {
      return prisma.chapter.update({
        where : {
          id : chapter.id
        }, 
        data: { position : index + 1 }
      })
    })
    
    await prisma.$transaction([
      ...updates,
        prisma.chapter.delete({
        where : {
          id: chapterId,
        }
      }),
    ])
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapitre supprimer avec succès",
    };
  } catch {
    return {
      status: "error",
      message: "Erreur lors de la suppression ",
    };
  }
}
