import SettingsNav from "@/modules/settings/components/settings-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Meetzeen",
  description: "Configuración de la empresa",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SettingsNav />
      {children}
    </div>
  )
}