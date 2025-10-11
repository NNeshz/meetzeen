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

  // PATCH DE SETTINGS
  async updateOrganizationName(userId: string, name: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      status: 200,
      message: "Nombre de la organización actualizado",
      data: organization,
    };
  }

  async updateOrganizationTimezone(userId: string, timezone: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        timezone,
      },
      select: {
        id: true,
        timezone: true,
      },
    });

    return {
      status: 200,
      message: "Timezone de la organización actualizado",
      data: organization,
    };
  }

  async updateOrganizationCurrency(userId: string, currency: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        currency,
      },
      select: {
        id: true,
        currency: true,
      },
    });

    return {
      status: 200,
      message: "Currency de la organización actualizado",
      data: organization,
    };
  }

  // PATCH DE IMAGE
  async updateOrganizationImage(userId: string, image: File) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    // Subir nueva imagen al bucket (carpeta 'logos')
    const newImageUrl = await this.imageService.createImage(image, "logos");

    // Buscar imagen anterior para eliminarla si existe
    const org = await prismaClient.organization.findUnique({
      where: { id: membership.organizationId },
      select: { imageUrl: true },
    });

    if (org?.imageUrl) {
      try {
        await this.imageService.deleteImage(org.imageUrl);
      } catch (error) {
        console.warn("Error al eliminar imagen anterior:", error);
      }
    }

    // Actualizar URL en la organización
    const updated = await prismaClient.organization.update({
      where: { id: membership.organizationId },
      data: { imageUrl: newImageUrl },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    return {
      status: 200,
      message: "Imagen de la organización actualizada",
      data: updated,
    };
  }

  async updateOrganizationSlogan(userId: string, slogan: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        slogan,
      },
      select: {
        id: true,
        slogan: true,
      },
    });

    return {
      status: 200,
      message: "Slogan de la organización actualizado",
      data: organization,
    };
  }

  async validateOrganizationSlug(slug: string) {
    const normalized = slug.toLowerCase().trim().replace(/\s+/g, "");

    if (!/^[a-z0-9ñ]{3,100}$/.test(normalized)) {
      return {
        status: 400,
        message:
          "Slug inválido. Solo letras (incluyendo ñ) y números, sin guiones (3-100 chars).",
        data: null,
      };
    }

    const existing = await prismaClient.organization.findFirst({
      where: { slug: normalized },
      select: { id: true },
    });

    if (existing) {
      return {
        status: 409,
        message: "Slug no disponible",
        data: { available: false, slug: normalized },
      };
    }

    return {
      status: 200,
      message: "Slug disponible",
      data: { available: true, slug: normalized },
    };
  }

  async updateOrganizationSlug(userId: string, slug: string) {
    const normalized = slug.toLowerCase().trim().replace(/\s+/g, "");

    if (!/^[a-z0-9ñ]{3,100}$/.test(normalized)) {
      return {
        status: 400,
        message:
          "Slug inválido. Solo letras (incluyendo ñ) y números, sin guiones (3-100 chars).",
        data: null,
      };
    }

    const membership = await prismaClient.member.findFirst({
      where: { userId, role: "owner" },
      select: { organizationId: true },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const conflict = await prismaClient.organization.findFirst({
      where: {
        slug: normalized,
        NOT: { id: membership.organizationId },
      },
      select: { id: true },
    });

    if (conflict) {
      return {
        status: 409,
        message: "Slug ya está en uso por otra organización",
        data: null,
      };
    }

    const updated = await prismaClient.organization.update({
      where: { id: membership.organizationId },
      data: { slug: normalized },
      select: { id: true, slug: true },
    });

    return {
      status: 200,
      message: "Slug de la organización actualizado",
      data: updated,
    };
  }

  async updateOrganizationAddress(userId: string, address: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        address,
      },
      select: {
        id: true,
        address: true,
      },
    });

    return {
      status: 200,
      message: "Dirección de la organización actualizada",
      data: organization,
    };
  }

  async updateOrganizationPhoneNumber(userId: string, phoneNumber: string) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true
      }
    })

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        phoneNumber,
      },
      select: {
        id: true,
        phoneNumber: true,
      },
    });

    return {
      status: 200,
      message: "Número de teléfono de la organización actualizado",
      data: organization,
    };
  }

  async updateOrganizationStart(
    userId: string,
    body: { startHour: number; startMinute: number; startAmPm: string }
  ) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        startHour: body.startHour,
        startMinute: body.startMinute,
        startAmPm: body.startAmPm,
      },
      select: {
        id: true,
        startHour: true,
        startMinute: true,
        startAmPm: true,
      },
    });

    return {
      status: 200,
      message: "Horario de inicio actualizado",
      data: organization,
    };
  }

  async updateOrganizationEnd(
    userId: string,
    body: { endHour: number; endMinute: number; endAmPm: string }
  ) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        endHour: body.endHour,
        endMinute: body.endMinute,
        endAmPm: body.endAmPm,
      },
      select: {
        id: true,
        endHour: true,
        endMinute: true,
        endAmPm: true,
      },
    });

    return {
      status: 200,
      message: "Horario de fin actualizado",
      data: organization,
    };
  }

  async updateOrganizationWorkdays(userId: string, workdays: number[]) {
    const membership = await prismaClient.member.findFirst({
      where: {
        userId,
        role: "owner",
      },
      select: {
        organizationId: true,
      },
    });

    if (!membership) {
      return {
        status: 404,
        message: "Organización no encontrada",
        data: null,
      };
    }

    const organization = await prismaClient.organization.update({
      where: {
        id: membership.organizationId,
      },
      data: {
        workDays: workdays,
      },
      select: {
        id: true,
        workDays: true,
      },
    });

    return {
      status: 200,
      message: "Días laborales actualizados",
      data: organization,
    };
  }

  async getOrganizationBySlugName(slugName: string) {
    const organization = await prismaClient.organization.findFirst({
      where: { slug: slugName },
      select: {
        id: true,
        name: true,
        slug: true,
        slogan: true,
        imageUrl: true,
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