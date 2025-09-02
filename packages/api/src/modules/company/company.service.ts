import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";
import {
  UpdateCompanySchema,
  UpdateCompanyDTO,
  CompanyResponseDTO,
} from "@meetzeen/api/src/modules/company/types/create-company.d";

export class CompanyService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async createOrUpdateCompany(
    body: {
      name: string;
      image?: File | string | null;
      slugName: string;
      phoneNumber: string;
      slogan?: string;
      address?: string;
      workDays: string[];
      startHour: string;
      startMinute: string;
      startAmPm: string;
      endHour: string;
      endMinute: string;
      endAmPm: string;
      hasImageChanged?: boolean;
    },
    userId: string
  ) {
    // Verificar si ya existe una empresa para este usuario
    const existingCompany = await prismaClient.company.findUnique({
      where: { userId },
    });

    if (existingCompany) {
      // Actualizar empresa existente
      return this.updateExistingCompany(body, userId, existingCompany);
    } else {
      // Crear nueva empresa
      return this.createNewCompany(body, userId);
    }
  }

  private async createNewCompany(
    body: {
      name: string;
      image?: File | string | null;
      slugName: string;
      phoneNumber: string;
      slogan?: string;
      address?: string;
      workDays: string[];
      startHour: string;
      startMinute: string;
      startAmPm: string;
      endHour: string;
      endMinute: string;
      endAmPm: string;
    },
    userId: string
  ) {
    // Verificar que el slugName no exista
    const existingSlug = await prismaClient.company.findUnique({
      where: { slugName: body.slugName },
    });

    if (existingSlug) {
      throw new Error("Este nombre de empresa ya está en uso. Por favor, elige otro.");
    }

    let imageUrl: string = "";
    
    // Solo procesar imagen si es un archivo
    if (body.image && typeof body.image !== "string") {
      imageUrl = await this.imageService.createImage(body.image, "logos");
    }

    const company = await prismaClient.company.create({
      data: {
        userId: userId,
        name: body.name,
        imageUrl: imageUrl,
        slugName: body.slugName,
        phoneNumber: body.phoneNumber,
        slogan: body.slogan ?? null,
        address: body.address ?? null,
        workDays: body.workDays,
        startHour: body.startHour,
        startMinute: body.startMinute,
        startAmPm: body.startAmPm,
        endHour: body.endHour,
        endMinute: body.endMinute,
        endAmPm: body.endAmPm,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      status: 201,
      message: "¡Bienvenido! Tu empresa ha sido creada con éxito",
      data: company,
    };
  }

  private async updateExistingCompany(
    body: {
      name: string;
      image?: File | string | null;
      slugName: string;
      phoneNumber: string;
      slogan?: string;
      address?: string;
      workDays: string[];
      startHour: string;
      startMinute: string;
      startAmPm: string;
      endHour: string;
      endMinute: string;
      endAmPm: string;
      hasImageChanged?: boolean;
    },
    userId: string,
    existingCompany: any
  ) {
    let imageUrl = existingCompany.imageUrl;

    if (body.hasImageChanged && body.image && typeof body.image !== "string") {
      if (existingCompany.imageUrl) {
        try {
          await this.imageService.deleteImage(existingCompany.imageUrl);
        } catch (error) {
          console.warn("Error al eliminar imagen anterior:", error);
        }
      }      
      imageUrl = await this.imageService.createImage(body.image, "logos");
    }

    const company = await prismaClient.company.update({
      where: { userId },
      data: {
        name: body.name,
        phoneNumber: body.phoneNumber,
        slogan: body.slogan ?? null,
        address: body.address ?? null,
        workDays: body.workDays,
        startHour: body.startHour,
        startMinute: body.startMinute,
        startAmPm: body.startAmPm,
        endHour: body.endHour,
        endMinute: body.endMinute,
        endAmPm: body.endAmPm,
        ...(body.hasImageChanged && { imageUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: "Empresa actualizada con éxito",
      data: company,
    };
  }

  async updateSocials(body: {
    facebook?: string;
    instagram?: string;
    twitterX?: string;
    tiktok?: string;
  }, userId: string) {
    const company = await prismaClient.company.update({
      where: { userId },
      data: {
        facebook: body.facebook ?? null,
        instagram: body.instagram ?? null,
        twitterX: body.twitterX ?? null,
        tiktok: body.tiktok ?? null,
      },
    });

    return {
      status: 200,
      message: "Redes sociales actualizadas con éxito",
      data: company,
    };
  }

  async getCompanyByUserId(userId: string) {
    const company = await prismaClient.company.findUnique({
      where: { userId },
      select: {
        name: true,
        imageUrl: true,
        slugName: true,
        phoneNumber: true,
        slogan: true,
        address: true,
        workDays: true,
        startHour: true,
        startMinute: true,
        startAmPm: true,
        endHour: true,
        endMinute: true,
        endAmPm: true,
        facebook: true,
        instagram: true,
        twitterX: true,
        tiktok: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    
    if (!company) {
      return {
        status: 404,
        message: "Empresa no encontrada",
        data: null,
      };
    }
    
    const formattedResponse = this.formatCompanyResponse(company);

    return {
      status: 200,
      message: "Empresa encontrada",
      data: formattedResponse,
    };
  }

  private formatCompanyResponse(company: {
    name: string;
    imageUrl: string;
    slugName: string;
    phoneNumber: string;
    slogan: string | null;
    address: string | null;
    workDays: string[];
    startHour: string;
    startMinute: string;
    startAmPm: string;
    endHour: string;
    endMinute: string;
    endAmPm: string;
    facebook: string | null;
    instagram: string | null;
    twitterX: string | null;
    tiktok: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }) {
    return {
      ...company,
      socials: {
        facebook: company.facebook ?? null,
        instagram: company.instagram ?? null,
        twitterX: company.twitterX ?? null,
        tiktok: company.tiktok ?? null,
      }
    }
  }

  async getCompanyById(companyId: string) {
    const company = await prismaClient.company.findUnique({
      where: { id: companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!company) {
      return {
        status: 404,
        message: "Empresa no encontrada",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Empresa encontrada",
      data: company,
    };
  }

  async getCompanyBySlugName(slugName: string) {
    const company = await prismaClient.company.findUnique({
      where: { slugName },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            services: true,
            employees: true,
          },
        },
      },
    });

    if (!company) {
      return {
        status: 404,
        message: "Empresa no encontrada",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Empresa encontrada",
      data: company,
    };
  }

  // Mantener método updateCompany por compatibilidad (deprecated)
  async updateCompany(body: {
    name: string;
    image: File | string;
    slugName: string;
    phoneNumber: string;
    slogan?: string;
    address?: string;
    workDays: string[];
    startHour: string;
    startMinute: string;
    startAmPm: string;
    endHour: string;
    endMinute: string;
    endAmPm: string;
  }, userId: string) {
    console.warn("updateCompany method is deprecated. Use createOrUpdateCompany instead.");
    
    // Verificar que la empresa pertenece al usuario
    const existingCompany = await prismaClient.company.findUnique({
      where: { userId },
    });

    if (!existingCompany) {
      throw new Error("No se encontró una empresa para este usuario");
    }

    const parsed = UpdateCompanySchema.safeParse(body);
    if (!parsed.success) {
      throw new Error("Validación fallida: " + parsed.error.message);
    }
    const validData: UpdateCompanyDTO = parsed.data;

    let imageUrl = existingCompany.imageUrl;

    // Si se proporciona un nuevo logo
    if (body.image && typeof body.image !== "string") {
      // Eliminar la imagen anterior si existe
      if (existingCompany.imageUrl) {
        try {
          await this.imageService.deleteImage(existingCompany.imageUrl);
        } catch (error) {
          console.warn("Error al eliminar imagen anterior:", error);
        }
      }
      imageUrl = await this.imageService.createImage(body.image, "logos");
    }

    const company = await prismaClient.company.update({
      where: { userId },
      data: {
        ...(validData.name && { name: validData.name }),
        ...(validData.phoneNumber && { phoneNumber: validData.phoneNumber }),
        ...(validData.slogan !== undefined && { slogan: validData.slogan }),
        ...(body.image && typeof body.image !== "string" && { imageUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: "Empresa actualizada con éxito",
      data: company,
    };
  }

  async deleteCompany(userId: string) {
    const existingCompany = await prismaClient.company.findUnique({
      where: { userId },
    });

    if (!existingCompany) {
      return {
        status: 404,
        message: "No se encontró una empresa para este usuario",
        data: null,
      };
    }

    // Eliminar la imagen del logo
    if (existingCompany.imageUrl) {
      try {
        await this.imageService.deleteImage(existingCompany.imageUrl);
      } catch (error) {
        console.warn("Error al eliminar imagen:", error);
        // No fallar la eliminación si no se puede eliminar la imagen
      }
    }

    await prismaClient.company.delete({
      where: { userId },
    });

    return {
      status: 200,
      message: "Empresa eliminada con éxito",
      data: null,
    };
  }
}