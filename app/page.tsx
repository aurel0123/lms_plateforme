"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  const { data: session } = authClient.useSession() 
  async function handleSignOut () {
    await authClient.signOut({
      fetchOptions : {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      }
    });
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {
        session? (
          <div>
            <p>
              {session.user.name}
            </p>
            <Button onClick={handleSignOut}>Logout</Button>
          </div>
        ):(
          <Link href="/login" className={buttonVariants({
            variant : 'default'

            })}
          >
            Login
          </Link>
        )
      }
      <ThemeToggle/>
    </div>
  );
}
