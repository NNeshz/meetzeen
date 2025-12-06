import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceCategoryService } from "@/modules/service-category/service/service-category-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
} from "@/modules/service-category/types/service-category.types";

export const useAllServiceCategories = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["service-categories", organizationId],
    queryFn: () =>
      serviceCategoryService.getAllServiceCategories(organizationId),
    enabled: !!organizationId,
  });

  return { data, isLoading, error, refetch };
};

export const useServiceCategory = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: createServiceCategory, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateServiceCategoryDto) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return serviceCategoryService.createServiceCategory(
        data.name,
        organizationId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-categories", organizationId],
      });
    },
  });

  const { mutate: updateServiceCategory, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateServiceCategoryDto) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return serviceCategoryService.updateServiceCategory(
        data.id,
        data.name,
        organizationId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-categories", organizationId],
      });
    },
  });

  const { mutate: deleteServiceCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return serviceCategoryService.deleteServiceCategory(id, organizationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-categories", organizationId],
      });
    },
  });

  return {
    createServiceCategory,
    isCreating,
    updateServiceCategory,
    isUpdating,
    deleteServiceCategory,
    isDeleting,
  };
};
