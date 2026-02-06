import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PageSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 p-4 rounded-full w-fit mx-auto">
            <RotateCcw className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Paiement annulé</CardTitle>
          <CardDescription className="max-w-sm text-muted-foreground mt-2">
            Votre paiement n&apos;a pas été finalisé. Aucun montant n&apos;a été débité de
            votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="mr-1 size-4" />
            Retour à la page d&apos;accueil
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
