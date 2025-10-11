"use client";

import { InputLoading } from "@/modules/dashboard/settings/components/input-loading";
import { AddressForm } from "@/modules/dashboard/settings/contact/address-form";
import { PhoneForm } from "@/modules/dashboard/settings/contact/phone-form";
import { StartForm } from "@/modules/dashboard/settings/contact/start-form";
import { EndForm } from "@/modules/dashboard/settings/contact/end-form";
import { useCompanyContact } from "@/modules/dashboard/settings/hooks/useNegocio";
import { Error } from "@/modules/landing/components/error";
import { WordaysForm } from "@/modules/dashboard/settings/contact/wordays-form";

export default function ContactPage() {
  const { data: contact, isLoading, isError, refetch } = useCompanyContact();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <InputLoading />
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
      <PhoneForm phoneNumber={contact?.data?.phoneNumber ?? ""} />
      <AddressForm address={contact?.data?.address ?? ""} />
      <WordaysForm workdays={contact?.data?.workDays ?? []} />
      <StartForm
        startHour={contact?.data?.startHour ?? 0}
        startMinute={contact?.data?.startMinute ?? 0}
        startAmPm={contact?.data?.startAmPm ?? ""}
      />
      <EndForm
        endHour={contact?.data?.endHour ?? 0}
        endMinute={contact?.data?.endMinute ?? 0}
        endAmPm={contact?.data?.endAmPm ?? ""}
      />
    </div>
  );
}
