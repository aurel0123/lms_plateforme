"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/general/render-description";
import { Button } from "@/components/ui/button";
import { useContruct } from "@/hooks/use-contruct";
import { BookIcon, CheckCircle } from "lucide-react";
import React, { useTransition } from "react";
import {
  MediaPlayer,
  MediaPlayerCaptions,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerFullscreen,
  MediaPlayerPiP,
  MediaPlayerPlay,
  MediaPlayerPlaybackSpeed,
  MediaPlayerSeek,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerTime,
  MediaPlayerVideo,
  MediaPlayerVolume,
} from "@/components/ui/media-player";
import { useConfetti } from "@/hooks/useConfetti";
import { toast } from "sonner";
import { tryCatch } from "@/lib/tryCatch";
import { makeLessonComplete } from "./actions";

interface AppProps {
  data: LessonContentType;
}

export default function LessonContent({ data }: AppProps) {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        makeLessonComplete(data.id, data.chapter.course.slug),
      );

      if (error) {
        toast.error("Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="h-full flex flex-col pl-6 bg-background ">
      <VideoPlayer
        thumbnailKey={data.thumbnailkey ?? ""}
        videoKey={data.videoUrl ?? ""}
      />
      <div className="border-b py-4">
        {data.lessonProgress.length > 0 ? (
          <Button variant={"outline"} className="bg-green-500/10 text-green-400 hover:text-green-400">
            <CheckCircle className="size-4 mr-1 text-green-400" />
            Terminé
          </Button>
        ) : (
          <Button variant={"outline"} onClick={onSubmit} disabled={isPending}>
            <CheckCircle className="size-4 mr-1 text-green-400" />
            Marquer comme terminé
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {data.title}
        </h1>

        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}

function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const thumbnailUrl = useContruct(thumbnailKey);
  const videoUrl = useContruct(videoKey);

  if (!videoUrl) {
    return (
      <div className="aspect-video rounded-lg flex flex-col items-center justify-center bg-muted">
        <BookIcon className="size-16 text-primary mb-4" />
        <p className="text-muted-foreground">
          Cette leçon n&apos;a pas encore de vidéo
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <MediaPlayer className="w-full h-full">
        <MediaPlayerVideo
          poster={thumbnailUrl}
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Votre navigateur ne supporte pas les vidéos
        </MediaPlayerVideo>

        <MediaPlayerControls className="flex-col items-start gap-2.5">
          <MediaPlayerControlsOverlay />
          <MediaPlayerSeek />

          <div className="flex w-full items-center gap-2 px-2 pb-2">
            <div className="flex flex-1 items-center gap-2">
              <MediaPlayerPlay />
              <MediaPlayerSeekBackward />
              <MediaPlayerSeekForward />
              <MediaPlayerVolume expandable />
              <MediaPlayerTime />
            </div>

            <div className="flex items-center gap-2">
              <MediaPlayerPlaybackSpeed />
              <MediaPlayerPiP />
              <MediaPlayerCaptions />
              <MediaPlayerFullscreen />
            </div>
          </div>
        </MediaPlayerControls>
      </MediaPlayer>
    </div>
  );
}
