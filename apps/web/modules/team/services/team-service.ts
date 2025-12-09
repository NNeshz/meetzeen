import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { UpdateMemberCalendar } from "@/modules/team/types/team.types";

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

  async getMemberCalendar(userId: string, organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await apiClient.team.calendar.get({
      query: { userId, organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateMemberCalendar(
    userId: string,
    organizationId: string,
    schedules: UpdateMemberCalendar[]
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await apiClient.team.calendar.put({
      organizationId: orgId,
      userId,
      schedules,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const teamService = new TeamService();
