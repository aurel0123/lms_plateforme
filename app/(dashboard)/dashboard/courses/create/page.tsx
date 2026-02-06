"use client";
import { buttonVariants, Button } from "@/components/ui/button";
import { ArrowLeft, Loader, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseCategory,
  courseLevel,
  courseSchema,
  courseSchemaType,
  courseStatus,
} from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { CreateCourse } from "./action";
import { tryCatch } from "@/lib/tryCatch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/useConfetti";
export default function CourseCreationPage() {
  const form = useForm<courseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "Développement personnel",
      smalldescription: "",
      slug: "",
      status: "Draft",
    },
  });

  const [isPending , startTransition] = useTransition(); 
  const router = useRouter(); 
  const {triggerConfetti} = useConfetti();
  function onSubmit(values: courseSchemaType) {
    startTransition(async () => {
      const {data : result , error} = await tryCatch(CreateCourse(values)); 

      if(error){
        toast.error("Please try again");
        return ; 
      }

      if(result.status ==="success"){
        toast.success(result.message);
        triggerConfetti(); 
        form.reset();
        router.push("/dashboard/courses/");
      }else if (result.status === "error") {
        toast.error(result.message);
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={"/dashboard/courses"}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Créer des cours</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
          <CardDescription>
            Ajoutez les informations principales qui décrivent votre cours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="w-fit "
                  onClick={() => {
                    const titleValue = form.getValues("title");
                    const slug = slugify(titleValue, {lower:true , strict : true , trim:true});
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  <Sparkles className="ml-1" size={16} />
                  Générer
                </Button>
              </div>
              <FormField
                control={form.control}
                name="smalldescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description courte</FormLabel>
                    <FormControl>
                       <Textarea
                        className="min-h-30"
                        placeholder="description courte..."
                        {...field}
                      /> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Image de couverture</FormLabel>
                    <FormControl>
                      <Uploader  value={field.value} onChange={field.onChange}/>
                      {/* <Input placeholder="image de couverture" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Catgorie</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selectionne la categorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategory.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Niveau</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selectionne la categorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevel.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Durée (heure)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Durée du cours" />
                      </FormControl>
                      <FormMessage />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Prix de la formation (FCFA)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Durée ddu cours" />
                      </FormControl>
                      <FormMessage />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Niveau</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selectionne la categorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
              {
                isPending ? (
                  <>
                    <Loader className="size-4 animate-spin"/>
                    Chargement...
                  </>
                ) : (
                  <>
                    <Plus /> Créer le cour
                  </>
                )
              }
                
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
