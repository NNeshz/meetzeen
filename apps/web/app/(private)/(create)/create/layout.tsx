import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Organización | Meetzeen",
  description: "Crea tu organización en Meetzeen",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-geist">{children}</div>;
}
