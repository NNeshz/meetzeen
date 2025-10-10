import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";

export class OrganizationService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

    async createOrganization(
    body: {
      name: string;
      timezone: string;
      currency: string;
    },
    userId: string
  ) {
    const existingMembership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
    });

    if (existingMembership) {
      throw new Error("Ya tienes una organización creada");
    }

    // Generar ID único para la organización
    const organizationId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generar ID único para el member
    const memberId = `member_${userId}_${Date.now()}`;

    const organization = await prismaClient.organization.create({
      data: {
        id: organizationId,
        name: body.name,
        timezone: body.timezone,
        currency: body.currency,
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

    await prismaClient.session.updateMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(), // Solo sesiones que no han expirado
        },
      },
      data: {
        activeOrganizationId: organizationId,
      },
    });

    return {
      status: 201,
      message: "Organización creada con éxito",
      data: organization,
    };
  }


  async getOrganizationSettings(userId: string) {
    const organization = await prismaClient.organization.findFirst({
      where: {
        members: {
          some: {
            userId,
            role: "owner",
          }
        }
      },
      select: {
        id: true,
        name: true,
        timezone: true,
        currency: true,
      }
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

  async getOrganizationImage(userId: string) {
    const organization = await prismaClient.organization.findFirst({
      where: {
        members: {
          some: {
            userId,
            role: "owner",
          }
        }
      },
      select: {
        imageUrl: true,
        slug: true,
        slogan: true,
      }
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
      message: "Imagen de la organización encontrada",
      data: organization,
    };
  }

  async getOrganizationContact(userId: string) {
    const organization = await prismaClient.organization.findFirst({
      where: {
        members: {
          some: {
            userId,
            role: "owner",
          }
        }
      },
      select: {
        phoneNumber: true,
        address: true,
        startAmPm: true,
        endAmPm: true,
        endHour: true,
        endMinute: true,
        startHour: true,
        startMinute: true,
        workDays: true,
      }
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
      message: "Contacto de la organización encontrada",
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
      id: service.id,
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