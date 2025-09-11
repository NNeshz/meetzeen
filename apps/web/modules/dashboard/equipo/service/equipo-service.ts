import { apiClient } from "@/utils/api-connection";
import { EmployeesFilters } from "@meetzeen/api/src/modules/employees/employees.route";

export class EquipoService {
  async createEmployee(data: {
    image?: File | undefined;
    name: string;
    email: string;
    phoneNumber: string;
    categoryIds: string; // Cambiado de string[] a string
  }) {
    const response = await apiClient.employees.create.post(data, {
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async listEmployees(filters: EmployeesFilters) {
    const cleanFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanFilters[key] = value;
      }
    });

    const response = await apiClient.employees.list.get({
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

  async updateEmployee(
    id: string,
    data: {
      name?: string;
      phoneNumber?: string;
      email?: string;
      image?: File | string | undefined;
      categoryIds?: string; // Cambiado de string[] a string
      hasImageChanged?: boolean;
    }
  ) {
    const response = await apiClient.employees({ id }).put(data, {
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async deleteEmployee(id: string) {
    const response = await apiClient.employees({ id }).delete(null, {
      fetch: {
        credentials: "include",
      },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateEmployeeSchedule(
    id: string,
    schedules: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[]
  ) {
    const response = await apiClient.employees({ id }).schedule.put(
      { schedules },
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
}
