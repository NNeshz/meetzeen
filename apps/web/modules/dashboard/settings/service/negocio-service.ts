import { apiClient } from "@/utils/api-connection";
import { CreateNegocioDTO } from "@/modules/dashboard/settings/types/create-negocio";

export class NegocioService {
  async createCompany(body: CreateNegocioDTO) {
    try {
      const response = await apiClient.organization.create.post(body, {
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al crear la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.createCompany error:", error);
      throw error;
    }
  }

  async getSettings() {
    try {
      const response = await apiClient.organization.settings.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener las configuraciones de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getSettings error:", error);
      throw error;
    }
  }

  async getImage() {
    try {
      const response = await apiClient.organization.image.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener la imagen de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getImage error:", error);
      throw error;
    }
  }

  async getContact() {
    try {
      const response = await apiClient.organization.contact.get({
        fetch: { credentials: "include" },
      });

      if (response.error) {
        throw new Error("Error al obtener el contacto de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.getContact error:", error);
      throw error;
    }
  }

  // PATCH DE SETTINGS
  async updateName(name: string) {
    try {
      const response = await apiClient.organization.name.patch(
        { name },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar el nombre de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateName error:", error);
      throw error;
    }
  }

  async updateTimezone(timezone: string) {
    try {
      const response = await apiClient.organization.timezone.patch(
        { timezone },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar el timezone de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateTimezone error:", error);
      throw error;
    }
  }

  async updateCurrency(currency: string) {
    try {
      const response = await apiClient.organization.currency.patch(
        { currency },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar la currency de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateCurrency error:", error);
      throw error;
    }
  }

  // PATCH DE IMAGE
  async updateImage(imageUrl: File) {
    try {
      const response = await apiClient.organization.image.patch(
        { image: imageUrl },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar la imagen de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateImage error:", error);
      throw error;
    }
  }

  async updateSlogan(slogan: string) {
    try {
      const response = await apiClient.organization.slogan.patch(
        { slogan },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar el slogan de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateSlogan error:", error);
      throw error;
    }
  }

  async validateOrganizationSlug(slug: string) {
    try {
      const response = await apiClient.organization.validateSlug.patch(
        { slug },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al validar el slug de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.validateOrganizationSlug error:", error);
      throw error;
    }
  }

  async updateSlug(slug: string) {
    try {
      const response = await apiClient.organization.slug.patch(
        { slug },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar el slug de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateSlug error:", error);
      throw error;
    }
  }

  // PATCH DE CONTACT
  async updateAddress(address: string) {
    try {
      const response = await apiClient.organization.address.patch(
        { address },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar la dirección de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateAddress error:", error);
      throw error;
    }
  }

  async updatePhoneNumber(phoneNumber: string) {
    try {
      const response = await apiClient.organization.phoneNumber.patch(
        { phoneNumber },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar el número de teléfono de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updatePhoneNumber error:", error);
      throw error;
    }
  }

  async updateStart(data: {
    startHour: number;
    startMinute: number;
    startAmPm: string;
  }) {
    try {
      const response = await apiClient.organization.start.patch(
        {
          startHour: data.startHour,
          startMinute: data.startMinute,
          startAmPm: data.startAmPm,
        },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar la hora de inicio de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateStart error:", error);
      throw error;
    }
  }

  async updateEnd(data: {
    endHour: number;
    endMinute: number;
    endAmPm: string;
  }) {
    try {
      const response = await apiClient.organization.end.patch(
        {
          endHour: data.endHour,
          endMinute: data.endMinute,
          endAmPm: data.endAmPm,
        },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error("Error al actualizar la hora de fin de la empresa");
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateEnd error:", error);
      throw error;
    }
  }

  async updateWorkdays(workdays: number[]) {
    try {
      const response = await apiClient.organization.workdays.patch(
        { workdays },
        {
          fetch: { credentials: "include" },
        }
      );

      if (response.error) {
        throw new Error(
          "Error al actualizar los días de trabajo de la empresa"
        );
      }

      return response.data;
    } catch (error) {
      console.error("NegocioService.updateWorkdays error:", error);
      throw error;
    }
  }
}

export const negocioService = new NegocioService();
