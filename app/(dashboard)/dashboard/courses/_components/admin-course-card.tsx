import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContruct } from "@/hooks/use-contruct";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface iAppCourseProps {
  data: AdminCoursesType;
}

export default function AdminCourseCard({ data }: iAppCourseProps) {
  const thmbnaileUrl = useContruct(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/courses/${data.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Modifier le cour
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}/`}>
                <Eye className="size-4 mr-2" />
                Prévisualiser
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" />
                Supprimer
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thmbnaileUrl ?? ""}
        alt="minuature"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/courses/${data.id}`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">
          {data.smalldescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>

        <Link
          href={`/dashboard/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Modifier le cour <ArrowRight className=" size-4 ml-2" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkelton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="size-8 rounded-md" />
      </div>

      <div className="relative w-full h-fit">
        <Skeleton className="h-[250] aspect-video w-full rounded-t-lg object-cover" />
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded"/>
        <Skeleton className="h-4 w-full mb-4 rounded"/>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-5">
            <Skeleton className="size-8 rounded-md"/>
            <Skeleton className="h-4 rounded w-10"/>
          </div>
          <div className="flex items-center gap-x-5">
            <Skeleton className="size-8 rounded-md"/>
            <Skeleton className="h-4 rounded w-10"/>
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded"/>
      </CardContent>
    </Card>
  );
}
