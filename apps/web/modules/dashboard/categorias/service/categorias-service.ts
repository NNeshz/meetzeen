import { apiClient } from "@/utils/api-connection";
import { CategoriesFilters } from "@meetzeen/api/src/modules/categories/categories.route";

export class CategoriasService {
  async createCategoria(name: string) {
    const response = await apiClient.categories.create.post(
      {
        name,
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

  async listCategorias(filters: CategoriesFilters) {
    const cleanFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key] = value;
      }
    });

    const response = await apiClient.categories.get({
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

  async updateCategoria(id: string, name: string) {
    const response = await apiClient.categories({ id }).put(
      {
        name,
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

  async deleteCategoria(id: string) {
    const response = await apiClient.categories({ id }).delete(null, {
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
