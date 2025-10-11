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

  // PATCH DE SETTINGS
  async updateName(name: string) {
    try {
      const response = await apiClient.organization.name.patch({ name }, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al actualizar el nombre de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateName error:", error);
      throw error;
    }
  }

  async updateTimezone(timezone: string) {
    try {
      const response = await apiClient.organization.timezone.patch({ timezone }, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al actualizar el timezone de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateTimezone error:", error);
      throw error;
    }
  }

  async updateCurrency(currency: string) {
    try {
      const response = await apiClient.organization.currency.patch({ currency }, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al actualizar la currency de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateCurrency error:", error);
      throw error;
    }
  }
}

export const negocioService = new NegocioService();
