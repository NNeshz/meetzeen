import { CompanyForm } from "@/modules/dashboard/negocio/components/company-form";

export function SectionCompany() {
  return (
    <div className="@container max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">🏫 Información de la empresa</p>
          <p className="text-muted-foreground">
            Llena el formulario para que podamos pasar al siguiente paso
          </p>
        </div>
        <div className="w-full">
          <CompanyForm />
        </div>
      </div>
    </div>
  );
}
