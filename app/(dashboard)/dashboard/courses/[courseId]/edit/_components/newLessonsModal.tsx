import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { lessonSchema, lessonSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Plus } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createLesson } from '../actions'
import { tryCatch } from '@/lib/tryCatch'
import { toast } from 'sonner'

export default function NewLessonsModal({courseId , chapterId} : {courseId : string , chapterId: string}) {
  const [isOpen, setOpen] = React.useState(false)
  const [pending , startTransition] = React.useTransition(); 

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues : {
      title : "", 
      courseId : courseId, 
      chapterId : chapterId, 
    }
  })

  async function onSubmit ( values : lessonSchemaType) {
    startTransition( async () => {
      const { data : result , error} = await tryCatch(createLesson(values))

      if(error) {
        toast.error("Erreur lors de la création")
        return ;
      }

      if(result.status === "success"){
        toast.success(result.message); 
        form.reset();
        setOpen(false);
      }else {
        toast.error(result.message); 
      }
    })
  }
  function handleOpenChange(open:boolean) {
    if(!open){
      form.reset()
    }
    setOpen(open)
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='gap-2 w-full justify-center' variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle lesson
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>Nouvelle lesson</DialogTitle>
          <DialogDescription>
            Ajouter un nouvelle lesson à votre chapitre.
          </DialogDescription>
        </DialogHeader>
        <form id="form-new-chapter" onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-title-lesson">
                    Titre du lesson
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-title-lesson"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex : Les bases en html"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit">
              {
                pending ? <> <Loader className='animate-spin'/> Sauvegarde...</> : "Sauvegarder"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
