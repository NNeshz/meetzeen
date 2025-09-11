import { apiClient } from "@/utils/api-connection";
import { CreateNegocioDTO } from "@/modules/dashboard/negocio/types/create-negocio";

export class NegocioService {
  async createCompany(body: CreateNegocioDTO) {
    try {
      const response = await apiClient.organization.createOrUpdate.post(body, {
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
      const response = await apiClient.organization.myOrganization.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener la organización");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getMyCompany error:", error);
      throw error;
    }
  }

  async updateSocials(body: {
    facebook?: string;
    instagram?: string;
    twitterX?: string;
    tiktok?: string;
  }) {
    try {
      const response = await apiClient.organization.socials.post(body, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al actualizar las redes sociales");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateSocials error:", error);
      throw error;
    }
  }
}

export const negocioService = new NegocioService();
