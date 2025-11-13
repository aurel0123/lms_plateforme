"use client";
import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, signInWithGithub } from "@/lib/auth-client";
import { Github, Loader, Send } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter() ; 
  const [githubPending, startTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState<string>("");

  async function signInGithub() {
    startTransition(async () => await signInWithGithub());
  }
  async function signInEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in", // required
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email send");
            router.push(`/verify-request?email=${email}`)
          },
          onError : () => {
            toast.error("Error sending email")
          }
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcom back!</CardTitle>
        <CardDescription>Login your Github Email Account </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          variant={"outline"}
          onClick={signInGithub}
          disabled={githubPending}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Github className="size-4" />
              Sign in with Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-border after:border-t after:z-0 after:flex after:items-center">
          <span className="relative bg-card z-10 px-2 text-muted-foreground">
            Or Continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="m@exemple.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            disabled={emailPending}
            onClick={signInEmail}
          >
            {
              emailPending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Continue with Email
                </>
              )
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
