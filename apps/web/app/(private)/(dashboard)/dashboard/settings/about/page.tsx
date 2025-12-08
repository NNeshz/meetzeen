"use client";

import { CompanyHoraryOpen } from "@/modules/company/components/company-horary-open";
import { CompanyHoraryClose } from "@/modules/company/components/company-horary-close";
import { CompanyWorkdays } from "@/modules/company/components/company-workdays";
import { CompanySocials } from "@/modules/company/components/company-socials";
import { CompanyLocation } from "@/modules/company/components/company-location";
import { useCompany } from "@/modules/company/hooks/use-company";
import { CompanyLoading } from "@/modules/company/components/company-loading";
import { CompanyError } from "@/modules/company/components/company-error";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsAboutPage() {
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
        <CompanyWorkdays
          workdays={companyData?.workdays || []}
          onUpdate={handleUpdate}
        />
        <CompanyHoraryOpen
          startTime={companyData?.startTime || ""}
          onUpdate={handleUpdate}
        />
        <CompanyHoraryClose
          endTime={companyData?.endTime || ""}
          onUpdate={handleUpdate}
        />
        <CompanyLocation
          location={companyData?.location || ""}
          onUpdate={handleUpdate}
        />
        <CompanySocials
          facebookLink={companyData?.facebookLink || ""}
          instagramLink={companyData?.instagramLink || ""}
          whatsappLink={companyData?.whatsappLink || ""}
          tiktokLink={companyData?.tiktokLink || ""}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
