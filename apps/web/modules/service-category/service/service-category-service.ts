import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class ServiceCategoryService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async createServiceCategory(name: string, organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.serviceCategories.post({
      name,
      organizationId: orgId,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getAllServiceCategories(organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.serviceCategories.get({
      query: { organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateServiceCategory(
    id: string,
    name: string,
    organizationId?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.serviceCategories({ id }).put(
      { name, organizationId: orgId },
      {
        query: { organizationId: orgId },
      }
    );

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async deleteServiceCategory(id: string, organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.serviceCategories({ id }).delete(
      { organizationId: orgId },
      {
        query: { organizationId: orgId },
      }
    );

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const serviceCategoryService = new ServiceCategoryService();