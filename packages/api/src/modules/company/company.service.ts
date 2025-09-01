import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";
import {
  CreateCompanySchema,
  CreateCompanyDTO,
  UpdateCompanySchema,
  UpdateCompanyDTO,
  CompanyResponseDTO,
} from "@meetzeen/api/src/modules/company/types/create-company.d";

export class CompanyService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async createCompany(form: FormData, userId: string) {
    const existingCompany = await prismaClient.company.findUnique({
      where: { userId },
    });

    if (existingCompany) {
      throw new Error("El usuario ya tiene una empresa asociada");
    }

    const rawData = form.get("data") as string;
    if (!rawData) throw new Error("Falta el campo 'data'");

    let data: unknown;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      throw new Error("El campo 'data' no es un JSON válido");
    }

    const parsed = CreateCompanySchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Validación fallida: " + parsed.error.message);
    }
    const validData: CreateCompanyDTO = parsed.data;

    const logo = form.get("logo") as File;
    if (!logo) throw new Error("Falta el archivo 'logo'");

    const imageUrl = await this.imageService.createImage(logo, "logos");

    const company: CompanyResponseDTO = await prismaClient.company.create({
      data: {
        name: validData.name,
        slugName: validData.slugName,
        phoneNumber: validData.phoneNumber,
        slogan: validData.slogan,
        imageUrl: imageUrl,
        userId: userId,
        address: validData.address,
        workDays: validData.workDays,
        startHour: validData.startHour,
        startMinute: validData.startMinute,
        startAmPm: validData.startAmPm,
        endHour: validData.endHour,
        endMinute: validData.endMinute,
        endAmPm: validData.endAmPm,
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
      message: "Empresa creada con éxito",
      data: company,
    };
  }

  async getCompanyByUserId(userId: string) {
    const company = await prismaClient.company.findUnique({
      where: { userId },
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
      throw new Error("No se encontró una empresa para este usuario");
    }

    return {
      status: 200,
      message: "Empresa encontrada",
      data: company,
    };
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
      throw new Error("Empresa no encontrada");
    }

    return {
      status: 200,
      message: "Empresa encontrada",
      data: company,
    };
  }

  async updateCompany(form: FormData, userId: string) {
    // Verificar que la empresa pertenece al usuario
    const existingCompany = await prismaClient.company.findUnique({
      where: { userId },
    });

    if (!existingCompany) {
      throw new Error("No se encontró una empresa para este usuario");
    }

    const rawData = form.get("data") as string;
    if (!rawData) throw new Error("Falta el campo 'data'");

    let data: unknown;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      throw new Error("El campo 'data' no es un JSON válido");
    }

    const parsed = UpdateCompanySchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Validación fallida: " + parsed.error.message);
    }
    const validData: UpdateCompanyDTO = parsed.data;

    let imageUrl = existingCompany.imageUrl;

    // Si se proporciona un nuevo logo
    const logo = form.get("logo") as File;
    if (logo) {
      // Eliminar la imagen anterior si existe
      if (existingCompany.imageUrl) {
        await this.imageService.deleteImage(existingCompany.imageUrl);
      }
      imageUrl = await this.imageService.createImage(logo, "logos");
    }

    const company = await prismaClient.company.update({
      where: { userId },
      data: {
        ...(validData.name && { name: validData.name }),
        ...(validData.phoneNumber && { phoneNumber: validData.phoneNumber }),
        ...(validData.slogan !== undefined && { slogan: validData.slogan }),
        ...(logo && { imageUrl }),
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
      throw new Error("No se encontró una empresa para este usuario");
    }

    // Eliminar la imagen del logo
    if (existingCompany.imageUrl) {
      await this.imageService.deleteImage(existingCompany.imageUrl);
    }

    await prismaClient.company.delete({
      where: { userId },
    });

    return {
      status: 200,
      message: "Empresa eliminada con éxito",
    };
  }
}
