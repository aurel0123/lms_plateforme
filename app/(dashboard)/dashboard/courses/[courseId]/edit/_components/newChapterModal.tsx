import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { chapterSchema, chapterSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Plus } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createChapter } from '../actions'
import { tryCatch } from '@/lib/tryCatch'
import { toast } from 'sonner'

export default function NewChapterModal({courseId} : {courseId : string}) {
  const [open, setOpen] = React.useState(false)
  const [pending , startTransition] = React.useTransition(); 

  const form = useForm<chapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues : {
      title : "", 
      courseId : courseId
    }
  })

  async function onSubmit ( values : chapterSchemaType) {
    startTransition( async () => {
      const { data : result , error} = await tryCatch(createChapter(values))

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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2' variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Chapitre
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>Nouveau Chapitre</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau chapitre à votre cours.
          </DialogDescription>
        </DialogHeader>
        <form id="form-new-chapter" onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-title-chapter">
                    Titre du chapitre
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-title-chapter"
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
