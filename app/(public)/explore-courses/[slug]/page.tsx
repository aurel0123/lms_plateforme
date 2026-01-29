import { getIndividualCourse } from "@/app/data/course/get-course";
import RenderDescription from "@/components/general/render-description";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import { Blocks, Book, ChartBar, ChartBarBig, Check, ChevronDown, Clock, LayoutGrid, Play } from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;
export default async function PageSlug({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video rounded-xl w-full overflow-hidden shadow-lg">
          <Image
            src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`}
            alt="Image de couverture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-md text-muted-foreground line-clamp-2 leading-relaxed">
              {course.smalldescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1 rounded-none">
              <ChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1 rounded-none">
              <Blocks className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1 rounded-none">
              <Clock className="size-4" />
              <span>{course.duration} heures</span>
            </Badge>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6 w-full">
            <h1 className="text-2xl font-semibold tracking-tight">
              Description du cour
            </h1>
            <RenderDescription json={JSON.parse(course.description)} />
          </div>

          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                Structure du cours
              </h1>
              <div>
                {course.chapters.length} Chapitres |{" "}
                {course.chapters.reduce(
                  (total, chapter) => total + chapter.lessons.length,
                  0,
                ) || 0}{" "}
                Leçons
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={false}>
                <Card className="p-0 overflow-hidden border-2 transition-all hover:shadow-md duration-200">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 ">
                            <p className="flex items-center justify-center rounded-full text-primary font-semibold bg-primary/10 size-10">
                              {index + 1}
                            </p>
                            <div>
                              <h1 className="text-xl text-left font-semibold">
                                {chapter.title}
                              </h1>
                              <p className="text-sm text-muted-foreground text-left">
                                {chapter.lessons.length}{" "}
                                {chapter.lessons.length === 1
                                  ? "Leçon"
                                  : "Leçons"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className="text-xs rounded-none"
                              variant={"outline"}
                            >
                              {chapter.lessons.length}{" "}
                              {chapter.lessons.length === 1
                                ? "Leçon"
                                : "Leçcons"}
                            </Badge>

                            <ChevronDown className="size-5" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t bg-muted/10">
                      <div className="p-6 pt-4 space-y-3">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-3 transition-colors rounded-xl hover:bg-accent"
                          >
                            <div className="size-8 flex items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <Play className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Lesson {lessonIndex + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Prix:</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                    minimumFractionDigits: 0,
                  }).format(course.price)}
                </span>
              </div>
              <div className="mb-3 space-y-3 rounded-xl bg-accent p-4">
                <h4>Ce que vous obtiendrez : </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="siz-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Durée du cour</p>
                      <p className="text-muted-foreground text-xs">
                        {course.duration} heures
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="siz-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <ChartBarBig className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Niveau</p>
                      <p className="text-muted-foreground text-xs">
                        {course.level} 
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="siz-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <LayoutGrid className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Categorie</p>
                      <p className="text-muted-foreground text-xs">
                        {course.category} 
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="siz-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <Book className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Total Leçons</p>
                      <p className="text-muted-foreground text-xs">
                        {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)} Leçons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 space-y-3">
                 <h4>
                    Ce cour incluis : 
                 </h4>
                 <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                        <div className="rounded-full p-1 bg-green-500/20 text-green-500">
                            <Check className="size-3"/>
                        </div>
                        <span>
                            Accès à vie 
                        </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <div className="rounded-full p-1 bg-green-500/20 text-green-500">
                            <Check className="size-3"/>
                        </div>
                        <span>
                            Accès sur pc et téléphone 
                        </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                        <div className="rounded-full p-1 bg-green-500/20 text-green-500">
                            <Check className="size-3"/>
                        </div>
                        <span>
                            Une attestation
                        </span>
                    </li>
                 </ul>
              </div>
              <Button className="w-full">
                Inscrivez-vous maintenant
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">30 jour de garantie</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
