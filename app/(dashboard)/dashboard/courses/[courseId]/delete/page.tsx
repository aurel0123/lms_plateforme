"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { AdminDeleteCourse } from "./action";
import { tryCatch } from "@/lib/tryCatch";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function DeleteCourse() {
    const router = useRouter();
    const [pending , startTransition] = React.useTransition(); 
    const params = useParams<{ courseId : string }>(); 
    const courseId = params.courseId ; 

    function handleDelete() {
        startTransition(async()=> {
            const {data : result , error } = await tryCatch(AdminDeleteCourse(courseId)); 

            if(error){
                toast.error("Veuillez réssayer");
                return ; 
            }

            if(result.status=== "success"){
                toast.success(result.message)
                router.push("/dashboard/courses/");
            }else{
                toast.error(result.message);
            }
        })
    }
  return (
    <Card className="max-w-xl mx-auto w-full mt-32">
      <CardHeader>
        <CardTitle>Etes-vous sûre de vouloir supprimer ce cour</CardTitle>
        <CardDescription>Cette action est irreversible</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Button asChild>
            <Link href="/dashboard/courses/">
                Annuler
            </Link>
        </Button>
        <Button variant={'destructive'} onClick={handleDelete} disabled={pending}>
            {
                pending ? <><Loader className="animate-spin"/>Suppression...</> : "Supprimer le cour"
            }
        </Button>
      </CardFooter>
    </Card>
  );
}
