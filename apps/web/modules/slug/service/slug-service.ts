import { apiClient } from "@/lib/api/client";

export class SlugService {
  constructor() {}

  async getCompanyBySlug(slug: string) {
    const response = await apiClient.slug.company.get({
      query: { slug },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getAvailability(
    companyId: string,
    services: string[],
    clientTimeZone: string,
    clientCurrentTime: string
  ) {
    const response = await apiClient.slug.availability.get({
      query: { companyId, services, clientTimeZone, clientCurrentTime },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const slugService = new SlugService();
