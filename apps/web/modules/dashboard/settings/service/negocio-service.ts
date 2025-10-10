import { apiClient } from "@/utils/api-connection";
import { CreateNegocioDTO } from "@/modules/dashboard/settings/types/create-negocio";

export class NegocioService {
  async createCompany(body: CreateNegocioDTO) {
    try {
      const response = await apiClient.organization.create.post(body, {
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

  async getSettings() {
    try {
      const response = await apiClient.organization.settings.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener las configuraciones de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getSettings error:", error);
      throw error;
    }
  }

  async getImage() {
    try {
      const response = await apiClient.organization.image.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener la imagen de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getImage error:", error);
      throw error;
    }
  }
}

export const negocioService = new NegocioService();
