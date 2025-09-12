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