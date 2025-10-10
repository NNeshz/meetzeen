import { NavigationSettings } from "@/modules/dashboard/settings/components/navigation-settings";

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
