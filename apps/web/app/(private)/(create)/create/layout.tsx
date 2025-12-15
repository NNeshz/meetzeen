import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromBackend } from "@/modules/dashboard/utils/verification";

export const metadata: Metadata = {
  title: "Crear Organización | Meetzeen",
  description: "Crea tu organización en Meetzeen",
};

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromBackend();

  if (!session || !session.user) {
    console.log("No session or user found");
    redirect("/");
  }

  return <div className="font-geist">{children}</div>;
}
