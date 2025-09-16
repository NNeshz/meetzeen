import { useQuery } from "@tanstack/react-query";
import { SlugService } from "@/modules/landing/slug/service/slug-service";

const slugService = new SlugService();

export const useSlugQuery = (slugName: string) => {
  return useQuery({
    queryKey: ["organization", slugName],
    queryFn: () => slugService.findOrgBySlug(slugName),
    enabled: !!slugName, 
    refetchOnWindowFocus: false,
    retry: 1, 
    staleTime: 5 * 60 * 1000,
  });
};

export const useServicesQuery = (slugName: string) => {
  return useQuery({
    queryKey: ["services", slugName],
    queryFn: () => slugService.findServicesBySlug(slugName),
    enabled: !!slugName, 
    refetchOnWindowFocus: false,
    retry: 1, 
    staleTime: 5 * 60 * 1000,
  });
}

export const useCheckAvailability = (data: {
  services: Array<{
    id: string;
    duration: string;
    name?: string;
    categoryId: string;
  }>;
}, organizationId: string) => {
  return useQuery({
    queryKey: ["availability", data, organizationId],
    queryFn: () => slugService.checkAvailavility(data, organizationId),
    enabled: !!data.services.length && !!organizationId,
  });
}