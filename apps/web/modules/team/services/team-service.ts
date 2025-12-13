import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { CreateTimeBlocks, TimeBlock } from "@/modules/team/types/team.types";

export class TeamService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async getTeam(organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.team.get({
      query: { organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getCalendar(
    memberId: string,
    startDate: string,
    endDate: string,
    organizationId?: string,
    timezone?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    // Obtener la zona horaria del cliente si no se proporciona
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await apiClient.team.calendar.get({
      query: {
        memberId,
        organizationId: orgId,
        startDate,
        endDate,
        timezone: tz,
      },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async createTemplate(
    memberId: string,
    organizationId: string,
    timeBlocks: CreateTimeBlocks[]
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.team.createTemplate.post({
      memberId,
      organizationId: orgId,
      timeBlocks,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateWeeklyTemplate(
    memberId: string,
    dayOfWeek: number,
    timeBlocks: TimeBlock[],
    organizationId?: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.team.template.put({
      organizationId: orgId,
      memberId,
      dayOfWeek,
      timeBlocks,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async setDayAvailability(
    memberId: string,
    organizationId: string,
    date: string,
    timeBlocks: TimeBlock[],
    reason?: string
  ) {
    const response = await apiClient.team.day.put({
      memberId,
      organizationId,
      date,
      timeBlocks,
      reason,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async setDaysOff(
    memberId: string,
    organizationId: string,
    startDate: string,
    endDate: string,
    reason?: string
  ) {
    const response = await apiClient.team.daysOff.put({
      memberId,
      organizationId,
      startDate,
      endDate,
      reason,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async setMultipleDaysAvailability(
    memberId: string,
    organizationId: string,
    dates: string[],
    timeBlocks: TimeBlock[],
    reason?: string
  ) {
    const response = await apiClient.team.multipleDays.put({
      memberId,
      organizationId,
      dates,
      timeBlocks,
      reason,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateSchedule(
    memberId: string,
    organizationId: string,
    action: "solo-este-dia" | "repetir" | "vacaciones" | "para-siempre",
    date: string,
    timeBlocks: TimeBlock[],
    repeatCount?: number,
    reason?: string
  ) {
    const response = await apiClient.team.updateSchedule.put({
      memberId,
      organizationId,
      action,
      date,
      timeBlocks,
      repeatCount,
      reason,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async removeDayException(
    memberId: string,
    organizationId: string,
    date: string
  ) {
    const response = await apiClient.team.exception({ date }).delete(
      {},
      {
        query: {
          memberId,
          organizationId,
        },
      }
    );

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async removeSchedule(
    memberId: string,
    organizationId: string,
    date: string
  ) {
    const response = await apiClient.team.removeSchedule.delete(
      {},
      {
        query: {
          memberId,
          organizationId,
          date,
        },
      }
    );

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const teamService = new TeamService();
