import { apiClient } from "@/utils/api-connection";
import { EmployeesFilters } from "@meetzeen/api/src/modules/employees/employees.route";

// Tipos para entradas individuales de horarios
  export type EmployeeScheduleEntry = {
    id: string;
    dayOfWeek: number; // 1-7
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

export class EquipoService {
  async createEmployee(data: {
    image?: File | undefined;
    name: string;
    email: string;
    phoneNumber: string;
    categoryIds: string; 
    schedules?: {
      dayOfWeek: number; 
      startTime: string; 
      endTime: string;   
    }[];
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

  async getEmployeeAvailability(
    id: string,
    params?: { months?: number; startDate?: string; endDate?: string }
  ) {
    const query: Record<string, string> = {};
    if (params?.months !== undefined) query.months = String(params.months);
    if (params?.startDate) query.startDate = params.startDate;
    if (params?.endDate) query.endDate = params.endDate;
  
    const response = await apiClient.employees({ id }).availability.get({
      query,
      fetch: {
        credentials: "include",
      },
    });
  
    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  // Listar horarios individuales del empleado
  async listEmployeeSchedules(id: string) {
    const response = await apiClient.employees({ id }).schedule.get({
      fetch: { credentials: "include" },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  // Crear una entrada de horario individual
  async createEmployeeSchedule(
    id: string,
    schedule: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      order?: number;
      isActive?: boolean;
    }
  ) {
    const response = await apiClient.employees({ id }).schedule.post(schedule, {
      fetch: { credentials: "include" },
    });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  // Actualizar una entrada específica del horario
  async updateEmployeeScheduleEntry(
    id: string,
    scheduleId: string,
    updates: {
      dayOfWeek?: number;
      startTime?: string;
      endTime?: string;
      order?: number;
      isActive?: boolean;
    }
  ) {
    const response = await apiClient
      .employees({ id })
      .schedule({ scheduleId })
      .patch(updates, {
        fetch: { credentials: "include" },
      });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  // Eliminar una entrada específica del horario
  async deleteEmployeeScheduleEntry(id: string, scheduleId: string) {
    const response = await apiClient
      .employees({ id })
      .schedule({ scheduleId })
      .delete(null, {
        fetch: { credentials: "include" },
      });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  // Reemplazar todas las entradas de un día concreto
  async replaceEmployeeDaySchedules(
    id: string,
    dayOfWeek: number,
    schedules: Array<{
      startTime: string;
      endTime: string;
      order?: number;
      isActive?: boolean;
    }>
  ) {
    const response = await apiClient
      .employees({ id })
      .schedule.day({ dayOfWeek })
      .put(schedules, {
        fetch: { credentials: "include" },
      });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async conditionalUpdateEmployeeSchedules(
    id: string,
    payload: {
      selectedDate?: string;
      schedules: Array<{
        startTime: string;
        endTime: string;
        order?: number;
        isActive?: boolean;
      }>;
      onlyThisDay?: boolean;
      repeatWeeks?: number;
    }
  ) {
    const response = await apiClient
      .employees({ id })
      .schedule.conditional.put(payload, {
        fetch: { credentials: "include" },
      });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}
