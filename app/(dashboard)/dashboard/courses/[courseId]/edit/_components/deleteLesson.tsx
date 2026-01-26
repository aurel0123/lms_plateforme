import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { tryCatch } from "@/lib/tryCatch";
import { deleteLesson } from "../actions";
import { toast } from "sonner";

export default function DeleteLesson({
    chapterId , 
    courseId , 
    lessonId
} : {
    chapterId : string , 
    courseId : string , 
    lessonId : string
}) {
  const [open, setOpen] = React.useState(false);
  const [pending , startTransition] = React.useTransition() ; 

  async function handleDelete () {
    startTransition(async() => {
        const {data : result ,error } = await tryCatch(deleteLesson({chapterId , courseId , lessonId}))
        if(error){
            toast.error("Quelques choses s'est mal passé")
        }

        if(result?.status === "success"){
            toast.success(result.message); 
            setOpen(false)
        }else{
          toast.error(result?.message)
        }
    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='icon'>
            <Trash2 className="size-4"/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut être annulée. Cela supprimera définitivement la lesson
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
          >
            {
              pending ? "Suppresion" : "Supprimer"
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
