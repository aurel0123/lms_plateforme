import {z} from 'zod'

export const courseLevel = [
    "Beginner",
    "Intermediate", 
    "Advanced"
] as const

export const courseStatus = [
    "Draft", 
    "Published",
    "Archive"
] as const

export const courseCategory = [
  "Développement personnel",
  "Informatique et technologie",
  "Affaires et management",
  "Sciences et ingénierie",
  "Langues",
  "Arts et créativité",
  "Santé et bien-être",
  "Développement professionnel",
  "Loisirs et hobbies",
  "Sciences sociales et humanités",
  "Marketing digital",
  "Finance et comptabilité",
  "Leadership et management",
  "Intelligence artificielle",
  "Design graphique et UX/UI",
  "Entrepreneuriat et startups"
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." })
    .max(100, { message: "Le titre ne peut pas dépasser 100 caractères." }),

  description: z
    .string()
    .min(3, { message: "La description doit être plus détaillée (minimum 3 caractères)." }),

  fileKey: z
    .string()
    .min(1, { message: "Le fichier est obligatoire." }),

  price: z
    .coerce.number()
    .min(1, { message: "Le prix doit être supérieur à 0." }),

  duration: z
    .coerce.number()
    .min(1, { message: "La durée doit être d’au moins 1 minute." })
    .max(500, { message: "La durée ne peut pas dépasser 500 minutes." }),

  level: z.enum(courseLevel, {
    message: "Veuillez sélectionner un niveau valide."
  }),

  category: z
    .enum(courseCategory , {message: "La categorie est requise"}),

  smalldescription: z
    .string()
    .min(3, { message: "La courte description doit contenir au moins 3 caractères." })
    .max(1000, { message: "La courte description ne peut pas dépasser 200 caractères." }),

  slug: z
    .string()
    .min(3, { message: "Le slug doit contenir au moins 3 caractères." }),

  status: z.enum(courseStatus, {
    message: "Veuillez sélectionner un statut valide."
  })
});

export type courseSchemaType = z.infer<typeof courseSchema>; 