"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLast } from "@/components/animationIcon/ChevronLast";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Apprentissage interactif et engageant",
    description: "Quizzes, exercices et feedback instantané : apprenez en pratiquant pour une expérience vraiment dynamique.",
    icon: "🎯",
  },
  {
    title: "Accès aux cours de qualité, où que vous soyez",
    description: "Formez-vous à votre rythme, sur ordinateur ou mobile. La connaissance sans frontières, 24h/24.", 
    icon: "🌍",
  },
  {
    title: "Une progression mesurable et motivante",
    description: "Suivez vos progrès, gagnez des certifications et partagez vos réussites à chaque étape.",
    icon: "🚀",
  },
  {
    title: "Une communauté d’apprenants inspirante",
    description: "Rejoignez des milliers d’apprenants, échangez et avancez ensemble. L’apprentissage devient une aventure collective.",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>Le future de l&apos;education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight ">
            Améliorez votre Expérience d&apos;Apprentissage
          </h1>
          <p className="md:text-xl max-w-[700px] text-muted-foreground">
            L’apprentissage interactif à portée de main ! Accédez à des cours de
            qualité, n’importe où et à tout moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/explore-course"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Découvrez les cours
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
            >
              Se connecter <ChevronLast/>
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
