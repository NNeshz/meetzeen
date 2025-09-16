import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";

export class OrganizationService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async createOrUpdateOrganization(
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
    // Verificar si ya existe una organización donde el usuario es owner
    const existingMembership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      include: {
        organization: true,
      },
    });

    if (existingMembership) {
      // Actualizar organización existente
      return this.updateExistingOrganization(
        body,
        userId,
        existingMembership.organization
      );
    } else {
      // Crear nueva organización
      return this.createNewOrganization(body, userId);
    }
  }

  private async createNewOrganization(
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
    const existingSlug = await prismaClient.organization.findFirst({
      where: {
        slug: body.slugName,
      },
    });

    if (existingSlug) {
      throw new Error(
        "Este nombre de empresa ya está en uso. Por favor, elige otro."
      );
    }

    let imageUrl: string = "";

    // Solo procesar imagen si es un archivo
    if (body.image && typeof body.image !== "string") {
      imageUrl = await this.imageService.createImage(body.image, "logos");
    }

    // Generar ID único para el member
    const memberId = `member_${userId}_${Date.now()}`;

    // Crear organización con campos directos
    const organization = await prismaClient.organization.create({
      data: {
        id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: body.name,
        slug: body.slugName,
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
        imageUrl: imageUrl,
        members: {
          create: {
            id: memberId,
            userId,
            role: "owner",
          }
        },
      },
      include: {
        members: {
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
        },
      },
    });

    return {
      status: 201,
      message: "¡Bienvenido! Tu organización ha sido creada con éxito",
      data: organization,
    };
  }

  private async updateExistingOrganization(
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
    existingOrganization: any
  ) {
    let imageUrl = existingOrganization.imageUrl || "";

    if (body.hasImageChanged && body.image && typeof body.image !== "string") {
      if (existingOrganization.imageUrl) {
        try {
          await this.imageService.deleteImage(existingOrganization.imageUrl);
        } catch (error) {
          console.warn("Error al eliminar imagen anterior:", error);
        }
      }
      imageUrl = await this.imageService.createImage(body.image, "logos");
    }

    const organization = await prismaClient.organization.update({
      where: { id: existingOrganization.id },
      data: {
        name: body.name,
        slug: body.slugName,
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
        members: {
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
        },
      },
    });

    return {
      status: 200,
      message: "Organización actualizada con éxito",
      data: organization,
    };
  }

  async updateSocials(
    body: {
      facebook?: string;
      instagram?: string;
      twitterX?: string;
      tiktok?: string;
    },
    userId: string
  ) {
    // Buscar la organización donde el usuario es owner
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      throw new Error("No tienes permisos para actualizar esta organización");
    }

    const organization = await prismaClient.organization.update({
      where: { id: membership.organizationId },
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
      data: organization,
    };
  }

  async getOrganizationByUserId(userId: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      include: {
        organization: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const formattedResponse = this.formatOrganizationResponse(
      membership.organization,
      membership.user
    );

    return {
      status: 200,
      message: "Organización encontrada",
      data: formattedResponse,
    };
  }

  private formatOrganizationResponse(organization: any, user: any) {
    return {
      id: organization.id,
      name: organization.name,
      imageUrl: organization.imageUrl || "",
      slugName: organization.slug,
      phoneNumber: organization.phoneNumber || "",
      slogan: organization.slogan,
      address: organization.address,
      workDays: organization.workDays || [],
      startHour: organization.startHour || "",
      startMinute: organization.startMinute || "",
      startAmPm: organization.startAmPm || "",
      endHour: organization.endHour || "",
      endMinute: organization.endMinute || "",
      endAmPm: organization.endAmPm || "",
      user: user,
      socials: {
        facebook: organization.facebook ?? null,
        instagram: organization.instagram ?? null,
        twitterX: organization.twitterX ?? null,
        tiktok: organization.tiktok ?? null,
      },
    };
  }

  async getOrganizationById(organizationId: string) {
    const organization = await prismaClient.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Organización encontrada",
      data: organization,
    };
  }

  async getOrganizationBySlugName(slugName: string) {
    const organization = await prismaClient.organization.findFirst({
      where: {
        slug: slugName,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Organización encontrada",
      data: organization,
    };
  }

  async getServicesBySlugName(slugName: string) {
    const organization = await prismaClient.organization.findFirst({
      where: {
        slug: slugName,
      },
      select: {
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            category: {
              select: {
                id: true,
                name: true,
              }
            },
          }
        },
        employees: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            categories: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
    if (!organization) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }
    // Transform services to match desired output format
    const formattedServices = organization.services.map(service => ({
      service: service.name,
      duration: service.duration,
      category: service.category,
      price: service.price,
      employees: organization.employees.filter(employee => 
        employee.categories.some(cat => cat.id === service.category.id)
      )
    }));
    return {
      status: 200,
      message: "Servicios encontrados",
      data: formattedServices,
    };
  }

  async deleteOrganization(userId: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message:
          "No se encontró una organización para este usuario o no tienes permisos",
        data: null,
      };
    }

    // Eliminar la imagen del logo
    if (membership.organization.imageUrl) {
      try {
        await this.imageService.deleteImage(membership.organization.imageUrl);
      } catch (error) {
        console.warn("Error al eliminar imagen:", error);
      }
    }

    await prismaClient.organization.delete({
      where: { id: membership.organizationId },
    });

    return {
      status: 200,
      message: "Organización eliminada con éxito",
      data: null,
    };
  }
}