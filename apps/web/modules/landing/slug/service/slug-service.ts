import { apiClient } from "@/utils/api-connection";

export class SlugService {
  async findOrgBySlug(slugName: string) {
    const response = await apiClient.organization({ slugName }).get();

    if (response.error) {
      throw response.error.value
    }

    return response.data;
  }

  async checkAvailavility(data: {
    services: Array<{
      id: string;
      duration: string;
      name?: string;
      categoryId: string;
    }>;
  }, organizationId: string) {
    const response = await apiClient.appointments.checkAvailability({ organizationId }).post({
      serviciosSolicitados: data.services,
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}
