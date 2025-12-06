import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class ServiceService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async createService(
    name: string,
    serviceCategoryId: string,
    description: string,
    price: number,
    duration: number,
    discount: number,
    organizationId?: string,
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.services.post({
      name,
      serviceCategoryId,
      description,
      price,
      duration,
      discount,
      organizationId: orgId,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getAllServices(organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.services.get({
      query: { organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const serviceService = new ServiceService();