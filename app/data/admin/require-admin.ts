import 'server-only';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async  function RequireAdmin() {
  const session = await auth.api.getSession({
    headers : await headers()
  }); 

  if(!session) {
    redirect('/login');
  }
  if(session.user.role !== "admin") {
    return redirect('/not-admin');
  }
  return session;
}
