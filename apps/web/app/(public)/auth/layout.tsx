import { redirect } from "next/navigation";
import { getSessionFromBackend } from "@/modules/dashboard/utils/verification";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromBackend();

  // Si el usuario ya tiene sesión, redirigir al dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

