"use client";

import { CompanyForm } from "@/modules/dashboard/negocio/components/company-form";
import { CompanySocialForm } from "@/modules/dashboard/negocio/components/company-social-form";
import { Separator } from "@meetzeen/ui/src/components/separator";

import { useCompany } from "@/modules/dashboard/negocio/hooks/useNegocio";
import { IconDeviceMobile, IconInfoCircle } from "@tabler/icons-react";

export function SectionCompany() {
  const { data: company, isLoading, isError } = useCompany();

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4">
      {/* Sección de Información de la Empresa */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center">
            <IconInfoCircle className="inline-block size-5 mr-2 text-brand" />
            Información de la empresa
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
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center">
            <IconDeviceMobile className="inline-block size-5 mr-2 text-brand" />
            Redes Sociales
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
