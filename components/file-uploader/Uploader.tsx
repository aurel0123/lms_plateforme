"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import RenderState, {
  RenderErrorState,
  RenderLoadingState,
  RenderUploadedState,
} from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useContruct } from "@/hooks/use-contruct";

interface UploadProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  typeImage: "image" | "video";
}

interface iAppProps{
  value? : string ;
  onChange? : (value:string) => void;
}
export default function Uploader({onChange , value} : iAppProps) {
  const fileUrl = useContruct(value || ''); 
  const [fileState, setFileState] = useState<UploadProps>({
    error: false,
    id: null,
    file: null,
    progress: 0,
    isDeleting: false,
    uploading: false,
    typeImage: "image",
    key:value, 
    objectUrl: fileUrl,
  });

  async function UploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    const payload = {
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      isImage: true,
    };
    try {
      const presignedResponse = await axios.post("/api/S3/upload/", payload);

      if (presignedResponse.status !== 200) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }
      const { presignedUrl, key } = presignedResponse.data;

      const UploadResponse = await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setFileState((prev) => ({ ...prev, progress: percent }));
          }
        },
      });

      if (UploadResponse.status == 200) {
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          key,
          progress: 100,
        }));
        onChange?.(key); 
        toast.success("Upload réussi !");
      }
    } catch {
      toast.error("Quelques choses s'est mal passé");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        error: true,
        progress: 0,
      }));
    }
  }

  async function handleRemoveFile() {
    if (fileState.isDeleting && !fileState.objectUrl) return;
    setFileState((prev) => ({
      ...prev,
      isDeleting: true,
    }));
    try {
      const response = await axios.delete("/api/S3/delete", {
        data: { key: fileState.key },
      });
      if (response.status !== 200) {
        toast.error("Erreur lors de la suppression");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.("")
      setFileState(() => ({
        error: false,
        id: null,
        file: null,
        progress: 0,
        isDeleting: false,
        uploading: false,
        typeImage: "image",
        objectUrl: undefined,
      }));
      toast.success("Fichier supprimer avec succès");
    } catch {
      toast.error("Erreur lors de la suppression. Veuillez ressayer");
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
        error: true,
      }));
    }
  }
  const onDrop = useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file: file,
          error: false,
          id: uuidv4(),
          progress: 0,
          isDeleting: false,
          uploading: false,
          typeImage: "image",
          objectUrl: URL.createObjectURL(file),
          
        });

        UploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeBig) {
        toast.error("Fichier trop grand la taille maximal est de 5mb");
      }
      if (tooManyFiles) {
        toast.error(
          "Plusieurs fichier selectionner le nombre maximun est de <strong>1</strong>"
        );
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: rejectedFiles,
    disabled : fileState.uploading || !!fileState.objectUrl , 
  });

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderLoadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return <RenderUploadedState previewUrl={fileState.objectUrl} handleRemoveFile={handleRemoveFile} isDeleting={fileState.isDeleting}/>;
    }
    return <RenderState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed tansition-color duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/30 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
