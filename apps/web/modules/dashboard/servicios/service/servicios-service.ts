import { apiClient } from "@/utils/api-connection";
import { ServicesFilters } from "@meetzeen/api/src/modules/services/services.route";

export class ServiciosService {
  async createServicio(name: string, duration: string, price: number, categoryId: string) {
    const response = await apiClient.services.create.post(
      {
        name,
        duration,
        price,
        categoryId,
      },
      {
        fetch: {
          credentials: "include",
        },
      }
    );

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async listServicios(filters: ServicesFilters) {
    const cleanFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key] = value;
      }
    });

    const response = await apiClient.services.get({
      query: cleanFilters,
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async getServicioById(id: string) {
    const response = await apiClient.services({ id }).get({
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateServicio(id: string, name: string, duration: string, price: number, categoryId: string) {
    const response = await apiClient.services({ id }).put(
      {
        name,
        duration,
        price,
        categoryId,
      },
      {
        fetch: {
          credentials: "include",
        },
      }
    );

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async deleteServicio(id: string) {
    const response = await apiClient.services({ id }).delete(null, {
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const serviciosService = new ServiciosService();