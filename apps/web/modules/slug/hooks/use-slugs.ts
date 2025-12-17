import { slugService } from "@/modules/slug/service/slug-service";
import { useQuery } from "@tanstack/react-query";

export const useCompanyBySlug = (slug: string) => {
  const {
    data: companyData,
    isLoading: isGettingCompany,
    error: errorGettingCompany,
  } = useQuery({
    queryKey: ["company", "slug", slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("Slug is required");
      }
      return slugService.getCompanyBySlug(slug);
    },
    enabled: !!slug,
  });

  return {
    companyData,
    isGettingCompany,
    errorGettingCompany,
  };
};

export const useAvailability = (
  companyId: string | undefined,
  serviceIds: string[]
) => {
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    error: errorAvailability,
  } = useQuery({
    queryKey: ["availability", companyId, serviceIds],
    queryFn: () => {
      if (!companyId || serviceIds.length === 0) {
        throw new Error("Company ID and at least one service are required");
      }
      return slugService.getAvailability(companyId, serviceIds);
    },
    enabled: !!companyId && serviceIds.length > 0,
  });

  return {
    availabilityData,
    isLoadingAvailability,
    errorAvailability,
  };
};