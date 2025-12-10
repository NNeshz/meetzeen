import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

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
}

export const teamService = new TeamService();
