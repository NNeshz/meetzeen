import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class AppointmentsService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  /**
   * Obtiene todas las citas desde la fecha del cliente en adelante, agrupadas por fecha
   * @param organizationId - ID de la organización
   * @param clientDate - Fecha del cliente en formato YYYY-MM-DD (hoy)
   * @param memberId - ID opcional del miembro para filtrar
   * @returns Array de objetos agrupados por fecha con formato { date: "Date:YYYY-MM-DD", appointments: [...] }
   */
  async getAppointments(
    organizationId: string,
    clientDate: string,
    memberId?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.appointments.get({
      query: { organizationId: orgId, clientDate, memberId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getAppointmentById(id: string) {
    const response = await apiClient.appointments({ id }).get({
      query: { organizationId: this.getOrganizationId() },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
