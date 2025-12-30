import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customersService } from "@/modules/customers/service/customers-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

interface UseAllCustomersParams {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
}

export const useAllCustomers = (params?: UseAllCustomersParams) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "customers",
      organizationId,
      params?.limit,
      params?.offset,
      params?.search,
      params?.sortBy,
    ],
    queryFn: () =>
      customersService.getAllCustomers(
        organizationId,
        params?.limit,
        params?.offset,
        params?.search,
        params?.sortBy
      ),
    enabled: !!organizationId,
  });

  return { data, isLoading, error, refetch };
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
    }) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return customersService.updateCustomer(
        data.id,
        {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        organizationId as string
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", organizationId],
      });
    },
  });

  return {
    updateCustomer,
    isUpdating,
  };
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return customersService.deleteCustomer(id, organizationId as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", organizationId],
      });
    },
  });

  return {
    deleteCustomer,
    isDeleting,
  };
};
