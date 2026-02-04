"use client";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/tryCatch";
import React from "react";
import { enrollInCourseAction } from "../action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = React.useTransition();
  function onSubmit() {
    startTransition(async () => {
      const { data: result } = await tryCatch(enrollInCourseAction(courseId));


      if (result?.status === "success") {
        toast.success(result.message);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <Button className="w-full" onClick={onSubmit} disabled={pending}>
        {
            pending ? <><Loader2 className="animate-spin"/> Inscription...</> : "Inscrivez-vous maintenant"
        }
      
    </Button>
  );
}
