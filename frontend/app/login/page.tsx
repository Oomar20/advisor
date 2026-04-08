import { redirect } from "next/navigation";

import { LoginPage } from "@/components/login-page";
import { getServerSessionUser } from "@/lib/server-auth";

export default async function Login() {
  const sessionUser = await getServerSessionUser();

  if (sessionUser) {
    redirect("/");
  }

  return <LoginPage />;
}
