"use client";

import { useCompanyBySlug } from "@/modules/slug/hooks/use-slugs";
import Image from "next/image";
import { CompanyInformation } from "@/modules/slug/company-information";
import { CompanyServicesResume } from "@/modules/slug/company-services-resume";

function getInitials(name: string | undefined): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  return initials || name.substring(0, 3).toUpperCase();
}

export function CompanyHeader({ slug }: { slug: string }) {
  const { companyData, isGettingCompany, errorGettingCompany } =
    useCompanyBySlug(slug);

  if (isGettingCompany) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (errorGettingCompany) {
    return (
      <div className="max-h-80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{errorGettingCompany.message}</p>
        </div>
      </div>
    );
  }

  const hasLogo = companyData?.company?.logo && companyData.company.logo.trim() !== "";
  const initials = getInitials(companyData?.company?.name);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        {/* Logo or Initials Avatar */}
        <div className="flex items-center justify-center">
          {hasLogo && companyData?.company?.logo ? (
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <Image
                src={companyData.company.logo}
                alt={companyData?.company?.name || "Company logo"}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          ) : (
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-brand flex items-center justify-center">
              <span className="text-2xl font-bold text-black">{initials}</span>
            </div>
          )}
        </div>

        {/* Company Name */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter">
            {companyData?.company?.name}
          </h1>
          {companyData?.company?.slug && (
            <p className="text-lg text-muted-foreground">@{companyData.company.slug}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {companyData && <CompanyInformation companyData={companyData.company} />}
          <CompanyServicesResume />
        </div>
      </div>
    </div>
  );
}
