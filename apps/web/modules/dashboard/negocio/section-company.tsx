"use client";

import { CompanyForm } from "@/modules/dashboard/negocio/components/company-form";
import { CompanySocialForm } from "@/modules/dashboard/negocio/components/company-social-form";
import { Card } from "@meetzeen/ui/src/components/card";
import { Separator } from "@meetzeen/ui/src/components/separator";

import { useCompany } from "@/modules/dashboard/negocio/hooks/useNegocio";

export function SectionCompany() {
  const { data: company, isLoading, isError } = useCompany();

  return (
    <div className="@container max-w-6xl space-y-4">
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">🏫 Información de la empresa</p>
          <p className="text-muted-foreground">
            Llena el formulario para que podamos pasar al siguiente paso
          </p>
        </div>
        <div className="w-full">
          <CompanyForm
            company={company?.data}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </Card>
      <Separator />
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">📱 Redes Sociales</p>
          <p className="text-muted-foreground">
            Llena el formulario para que podamos pasar al siguiente paso
          </p>
        </div>
        <div className="w-full">
          <CompanySocialForm
            socials={company?.data?.socials}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </Card>
    </div>
  );
}
