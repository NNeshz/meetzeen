import { apiClient } from "@/utils/api-connection";

export class NegocioService {
  async createCompany(formData: FormData) {
    try {
      const response = await apiClient.company.create.post(formData, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al crear la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.createCompany error:", error);
      throw error;
    }
  }

  async getMyCompany() {
    try {
      const response = await apiClient.company.myCompany.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getMyCompany error:", error);
      throw error;
    }
  }
}

export const negocioService = new NegocioService();
