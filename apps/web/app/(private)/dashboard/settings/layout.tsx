import { NavigationSettings } from "@/modules/dashboard/settings/components/navigation-settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Meetzeen",
};

export default function NegocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <NavigationSettings />
      {children}
    </div>
  );
}
