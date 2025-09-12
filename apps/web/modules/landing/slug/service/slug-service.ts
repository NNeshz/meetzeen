import { apiClient } from "@/utils/api-connection";

export class SlugService {
  async findOrgBySlug(slugName: string) {
    const response = await apiClient.organization({ slugName }).get();

    if (response.error) {
      throw response.error.value
    }

    return response.data;
  }
}
