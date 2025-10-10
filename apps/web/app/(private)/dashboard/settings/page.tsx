"use client"

import { CurrencyForm } from "@/modules/dashboard/settings/settings/currency-form";
import { DeleteForm } from "@/modules/dashboard/settings/settings/delete-form";
import { NameForm } from "@/modules/dashboard/settings/settings/name-form";
import { TimezoneForm } from "@/modules/dashboard/settings/settings/timezone-form";
import { useCompanySettings } from "@/modules/dashboard/settings/hooks/useNegocio";
import { InputLoading } from "@/modules/dashboard/settings/components/input-loading";
import { Error } from "@/modules/landing/components/error";

export default function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useCompanySettings();
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <InputLoading />
        <InputLoading />
        <InputLoading />
        <InputLoading />
      </div>
    );
  }
  
  if (isError) {
    return (
      <Error
        message="No se pudo cargar la configuración de la empresa."
        retry={() => refetch()}
      />
    );
  }
  
  return (
    <div className="space-y-8">
      <NameForm name={settings?.data?.name ?? ""} />
      <TimezoneForm timezone={settings?.data?.timezone ?? ""} />
      <CurrencyForm currency={settings?.data?.currency ?? ""} />
      <DeleteForm />
    </div>
  );
}
