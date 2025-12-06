import { apiClient } from "@/lib/api/client";

export class CompanyService {
  async getAllCompanies() {
    const response = await apiClient.company.allCompanies.get();

    if (response.error) {
      throw new Error(response.error.value as string);
    }

    return response.data;
  }

  async createCompany(companyName: string, timezone: string, currency: string) {
    const response = await apiClient.company.post({
      companyName,
      timezone,
      currency,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const companyService = new CompanyService();
