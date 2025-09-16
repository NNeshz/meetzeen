import { useQuery, useMutation } from "@tanstack/react-query";
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

export const useCheckAvailability = (organizationId: string) => {
  return useMutation({
    mutationFn: (data: {
      services: Array<{
        serviceId: string;
        employeeId: string;
      }>;
    }) => slugService.checkAvailability(data, organizationId),
  });
}