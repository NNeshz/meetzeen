import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class InvitationsService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async verifyToken(token: string) {
    const response = await apiClient.invitations.verify.get({
      query: { token },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async acceptInvitation(token: string) {
    const response = await apiClient.invitations.accept.post({ token });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getSendedInvitations(organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.invitations.sended.get({
      query: { organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async sendInvitation(email: string, role: string, organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.invitations.send.post({
      email,
      role,
      organizationId: orgId,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const invitationsService = new InvitationsService();
