"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CompanyHeader } from "@/modules/slug/company-header";
import { CompanyServices } from "@/modules/slug/company-services";
import { useSlugSteps } from "@/modules/slug/store/slug-steps";
import { CompanyEmployees } from "@/modules/slug/company-employees";
import { CompanyButtons } from "@/modules/slug/company-buttons";
import { CompanyClientForm } from "@/modules/slug/components/company-client-form";

export default function Page() {
  const params = useParams();
  const [slug, setSlug] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { steps } = useSlugSteps();
  
  useEffect(() => {
    const slugParam = params.slug as string;
    setSlug(slugParam || null);
    setIsInitializing(false);
  }, [params]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">No se encontró el parámetro slug</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <CompanyHeader slug={slug} />
      {steps === 1 && <CompanyServices slug={slug} />}
      {steps === 2 && <CompanyEmployees slug={slug} />}
      {steps === 3 && <CompanyClientForm />}
      <CompanyButtons />
    </div>
  );
}
