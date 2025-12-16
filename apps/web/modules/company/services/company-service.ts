import { apiClient } from "@/lib/api/client";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export class CompanyService {
  private getOrganizationId(): string {
    return useDashboardStore.getState().organization?.id || "";
  }

  async getAllCompanies() {
    const response = await apiClient.company.allCompanies.get();

    if (response.error) {
      throw new Error(response.error.value as string);
    }

    return response.data;
  }

  async createCompany(companyName: string, timezone: string, currency: string) {
    const response = await apiClient.company.post({
      companyName,
      timezone,
      currency,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getCompany(organizationId?: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.getCompany.get({
      query: { organizationId: orgId },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async getCompanyBySlug(slug: string) {
    const response = await apiClient.company.getCompanyBySlug.get({
      query: { slug },
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async uploadLogo(file: File, organizationId: string) {
    const response = await apiClient.company.uploadLogo.post(
      {
        organizationId,
        file,
      },
      {
        query: { organizationId },
      }
    );

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateCompanyName(companyName: string, organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeName.put({
      organizationId: orgId,
      companyName,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateCompanySlug(slug: string, organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeSlug.put({
      organizationId: orgId,
      slug,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateCompanyTimezone(timezone: string, organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeTimezone.put({
      organizationId: orgId,
      timezone,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateCompanyCurrency(currency: string, organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeCurrency.put({
      organizationId: orgId,
      currency,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateCompanyWorkdays(workdays: number[], organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeWorkdays.put({
      organizationId: orgId,
      workdays,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateStartHour(
    startHour: number,
    startMinute: number,
    organizationId: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeStartHour.put({
      organizationId: orgId,
      startHour,
      startMinute,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateEndHour(
    endHour: number,
    endMinute: number,
    organizationId: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeEndHour.put({
      organizationId: orgId,
      endHour,
      endMinute,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateLocation(location: string, organizationId: string) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeLocation.put({
      organizationId: orgId,
      location,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }

  async updateSocialLinks(
    socialLinks: {
      facebookLink?: string;
      instagramLink?: string;
      whatsappLink?: string;
      tiktokLink?: string;
    },
    organizationId: string
  ) {
    const orgId = organizationId || this.getOrganizationId();

    if (!orgId) {
      throw new Error("Organization ID is required");
    }

    const response = await apiClient.company.changeSocialLinks.put({
      organizationId: orgId,
      socialLinks,
    });

    if (response.error) {
      throw new Error(response.error.value.message);
    }

    return response.data;
  }
}

export const companyService = new CompanyService();
