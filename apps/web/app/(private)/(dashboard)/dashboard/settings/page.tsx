"use client";

import { CompanyLogo } from "@/modules/company/components/company-logo";
import { CompanyName } from "@/modules/company/components/company-name";
import { CompanySlug } from "@/modules/company/components/company-slug";
import { CompanyTimezone } from "@/modules/company/components/company-timezone";
import { CompanyCurrency } from "@/modules/company/components/company-currency";
import { useCompany } from "@/modules/company/hooks/use-company";
import { CompanyLoading } from "@/modules/company/components/company-loading";
import { CompanyError } from "@/modules/company/components/company-error";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { companyData, isGettingCompany, errorGettingCompany } = useCompany();
  const queryClient = useQueryClient();

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["company"] });
  };

  if (isGettingCompany) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <CompanyLoading key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (errorGettingCompany) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <CompanyError />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <CompanyLogo
          companyLogo={companyData?.logo}
          companyName={companyData?.name}
          onUpdate={handleUpdate}
        />
        <CompanyName
          companyName={companyData?.name || ""}
          onUpdate={handleUpdate}
        />
        <CompanySlug
          companySlug={companyData?.slug || ""}
          onUpdate={handleUpdate}
        />
        <CompanyTimezone
          companyTimezone={companyData?.timezone || ""}
          onUpdate={handleUpdate}
        />
        <CompanyCurrency
          companyCurrency={companyData?.currency || ""}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
