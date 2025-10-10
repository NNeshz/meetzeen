import { CurrencyForm } from "@/modules/dashboard/settings/settings/currency-form";
import { DeleteForm } from "@/modules/dashboard/settings/settings/delete-form";
import { NameForm } from "@/modules/dashboard/settings/settings/name-form";
import { TimezoneForm } from "@/modules/dashboard/settings/settings/timezone-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Meetzeen",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <NameForm />
      <TimezoneForm />
      <CurrencyForm />
      <DeleteForm />
    </div>
  );
}
