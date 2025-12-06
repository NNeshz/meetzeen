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
  // La verificación de sesión se hace en el proxy (proxy.ts)
  // No necesitamos verificación adicional aquí para evitar race conditions
  // durante el callback de OAuth
  return <div className="font-geist">{children}</div>;
}
