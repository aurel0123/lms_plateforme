import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
        onError: () => {
          toast.error("Erreur lors de la déconnexion");
        },
      },
    });
  };
  return handleSignOut;
}
