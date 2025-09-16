import { apiClient } from "@/utils/api-connection";

export class SlugService {
  async findOrgBySlug(slugName: string) {
    const response = await apiClient.organization.org({ slugName }).get();

    if (response.error) {
      throw response.error.value
    }

    return response.data;
  }

  async findServicesBySlug(slugName: string) {
    const response = await apiClient.organization.services({ slugName }).get();

    if (response.error) {
      throw response.error.value
    }

    return response.data;
  }

  async checkAvailability(data: {
    services: Array<{
      serviceId: string;
      employeeId: string;
    }>;
  }, organizationId: string) {
    const response = await apiClient.appointments.checkAvailability({ organizationId }).post({
      services: data.services,
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}
