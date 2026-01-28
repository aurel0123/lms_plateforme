import { cn } from "@/lib/utils";
import { CloudUploadIcon, Loader, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function RenderState({
  isDragActive,
}: {
  isDragActive: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "text-muted-foreground size-6",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p className="font-bold text-base text-foreground">
        Déposez vos fichiers ici ou{" "}
        <span className="text-primary font-bold cursor-pointer">
          cliquez sur télécharger
        </span>
      </p>
      <Button type="button" className="mt-4">
        sélectionner un fichier
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <CloudUploadIcon className={cn("text-destructive size-6")} />
      </div>
      <p className="text-base font-bold ">Erreur de téléchargement</p>
      <p className="text-sm text-muted-foreground">
        quelque chose s&apos;est mal passé
      </p>
      <Button className="mt-4" type="button">
        Réessayer la sélection de fichiers
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  handleRemoveFile,
  isDeleting,
  fileType,
}: {
  previewUrl: string;
  handleRemoveFile: () => void;
  isDeleting: boolean;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group flex items-center justify-center w-full h-full ">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={previewUrl}
          alt="Upload file"
          fill
          className="object-contain p-2"
          unoptimized={true}
        />
      )}

      <Button
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderLoadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <p>{progress}</p>
      <p className="text-sm mt-2 font-medium text-foreground">Téléchargement</p>
      <p className="text-xs mt-1 text-muted-foreground max-w-xs truncate">
        {file.name}
      </p>
    </div>
  );
}
