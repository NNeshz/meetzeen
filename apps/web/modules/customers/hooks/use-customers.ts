import { useQuery } from "@tanstack/react-query";
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