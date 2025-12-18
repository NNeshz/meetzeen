import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class CustomersService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async getAllCustomers(
    organizationId?: string,
    limit?: number,
    offset?: number,
    search?: string,
    sortBy?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.customers.get({
      query: { organizationId: orgId, limit, offset, search, sortBy },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const customersService = new CustomersService();
