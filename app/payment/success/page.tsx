"use client"
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfetti } from "@/hooks/useConfetti";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PageSuccess() {
    const {triggerConfetti} = useConfetti() ; 

    useEffect(() => {
        triggerConfetti()
    } , [triggerConfetti])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-green-500/10 p-4 rounded-full w-fit mx-auto">
            <Check className="size-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Paiement Réussi</CardTitle> 
          <CardDescription className="max-w-sm text-muted-foreground mt-2">
            Merci pour votre confiance.
            Votre paiement a été traité avec succès et votre commande est désormais confirmée.
            Vous pouvez maintenant suivre le cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="mr-1 size-4" />
            Retour au tableau de bord
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
