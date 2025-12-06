import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/modules/services/service/service-service";
import type { CreateServiceDto } from "@/modules/services/types/service.types";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export const useAllServices = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["services", organizationId],
    queryFn: () => serviceService.getAllServices(organizationId),
    enabled: !!organizationId,
  });

  return { data, isLoading, error, refetch };
};

export const useService = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: createService, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateServiceDto) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return serviceService.createService(
        data.name,
        data.serviceCategoryId,
        data.description,
        data.price,
        data.duration,
        data.discount,
        organizationId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", organizationId] });
    },
  });

  return {
    createService,
    isCreating,
  };
};
