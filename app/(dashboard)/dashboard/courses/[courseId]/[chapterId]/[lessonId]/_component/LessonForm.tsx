"use client";
import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/lib/tryCatch";
import { UpdateLesson } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}
export default function LessonForm({ data, chapterId, courseId }: AppProps) {
    const router = useRouter(); 
  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? undefined,
      thumbnailkey: data.thumbnailkey ?? undefined,
      videoUrl: data.videoUrl ?? undefined,
      chapterId : chapterId,
      courseId : courseId
    },
  });
  const [pending , startTransition] = useTransition(); 
  
  function onSubmit(values : lessonSchemaType){
    startTransition(async () => {
        const {data : result , error} = await tryCatch(UpdateLesson(values , data.id))
        if(error){
            toast.error("Veuillez ressayer")
            return ; 
        }
        if(result.status === "success"){
            form.reset(); 
            toast.success(result.message); 
            router.push(`/dashboard/courses/${courseId}/edit`); 
        }else {
            toast.error(result.message); 
        }
    })
  }
  return (
    <div>
      <Link
        href={`/dashboard/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
      >
        <ArrowLeft /> Retour
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Configuration d'une lesson</CardTitle>
          <CardDescription>
            Ajouter une video et une description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form  onSubmit={form.handleSubmit(onSubmit , (errors) => {
      console.log("FORM ERRORS 👉", errors);
    })}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-title">
                      Titre
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Titre de la lesson"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-description">
                      Description
                    </FieldLabel>
                    <RichTextEditor field={field}/>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="thumbnailkey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-thumbnailkey">
                      Page de couverture
                    </FieldLabel>
                    <Uploader value={field.value} onChange={field.onChange}/>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="videoUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-video-url">
                      Video 
                    </FieldLabel>
                    <Uploader value={field.value} onChange={field.onChange} fileTypeAccpted="video"/>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              
            </FieldGroup>

            <Button className="mt-6" type="submit">
                {
                    pending ? <><Loader className="animate-spin"/> Modifiaction...</> : "Modifier la lesson"
                }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
