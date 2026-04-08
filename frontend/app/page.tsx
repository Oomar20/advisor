import { redirect } from "next/navigation";

import { LandingPage } from "@/components/landing-page";
import { getServerSessionUser } from "@/lib/server-auth";

export default async function Home() {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  return <LandingPage user={sessionUser} />;
}
