"use client";

import { CompanyForm } from "@/modules/dashboard/negocio/components/company-form";
import { CompanySocialForm } from "@/modules/dashboard/negocio/components/company-social-form";
import { Separator } from "@meetzeen/ui/src/components/separator";

import { useCompany } from "@/modules/dashboard/negocio/hooks/useNegocio";
import { IconDeviceMobile, IconInfoCircle } from "@tabler/icons-react";

export function SectionCompany() {
  const { data: company, isLoading, isError } = useCompany();

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-2">
      {/* Sección de Información de la Empresa */}
      <div className="space-y-4">
        <div className="">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <IconInfoCircle className="shrink-0 size-5 text-brand" />
            <span className="truncate">Información de la empresa</span>
          </h2>
          <p className="text-muted-foreground">
            Llena el formulario para que podamos pasar al siguiente paso
          </p>
        </div>
        <CompanyForm
          company={company?.data}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      
      <Separator className="my-8" />
      
      {/* Sección de Redes Sociales */}
      <div className="space-y-4">
        <div className="">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <IconDeviceMobile className="shrink-0 size-5 text-brand" />
            <span className="truncate">Redes Sociales</span>
          </h2>
          <p className="text-muted-foreground">
            Conecta tus redes sociales para mayor visibilidad
          </p>
        </div>
        <CompanySocialForm
          socials={company?.data?.socials}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
