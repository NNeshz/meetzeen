import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class AppointmentsService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async getAppointments(
    organizationId: string,
    startDate: string,
    endDate: string,
    memberId?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.appointments.get({
      query: { organizationId: orgId, startDate, endDate, memberId },
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

  async getAppointmentsHistory(
    clientTimezone: string,
    clientCurrentTime: string,
    organizationId?: string,
    search?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.appointments.history.get({
      query: {
        organizationId: orgId,
        clientTimezone,
        clientCurrentTime,
        search,
      },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }
    return response.data;
  }

  async changeAppointmentStatus(id: string, status: string) {
    const response = await apiClient.appointments.changeAppointmentStatus.put({ id, status }, {
      query: { organizationId: this.getOrganizationId() },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async changePaymentStatus(id: string, status: string) {
    const response = await apiClient.appointments.changePaymentStatus.put({ id, status }, {
      query: { organizationId: this.getOrganizationId() },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async changePaymentMethod(id: string, method: string) {
    const response = await apiClient.appointments.changePaymentMethod.put({ id, method }, {
      query: { organizationId: this.getOrganizationId() },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
