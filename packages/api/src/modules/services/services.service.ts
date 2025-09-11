import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ServicesFilters } from "@meetzeen/api/src/modules/services/services.route";

export class ServicesService {
  constructor() {}

  async createService(name: string, duration: string, price: number, categoryId: string, userId: string) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      // Verificar que la categoría pertenece a la organización del usuario
      const category = await prismaClient.category.findFirst({
        where: {
          id: categoryId,
          organizationId: membership.organization.id,
        },
      });

      if (!category) {
        throw new Error("Categoría no encontrada o no tienes permisos para usarla");
      }

      const service = await prismaClient.service.create({
        data: {
          name,
          duration,
          price,
          categoryId,
          organizationId: membership.organization.id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: "Servicio creado exitosamente",
        data: service,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }

  async listServices(filters: ServicesFilters, userId: string) {
    try {
      const page = filters.page ?? 1;
      const limit = 12;
      const offset = (page - 1) * limit;

      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      const where: any = {
        organizationId: membership.organization.id,
        ...(filters.search && {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        }),
        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),
      };

      const [totalServices, services] = await Promise.all([
        prismaClient.service.count({ where }),
        prismaClient.service.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: limit,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalServices / limit);

      return {
        status: 200,
        message: "Servicios listados exitosamente",
        data: services,
        count: services.length,
        filters,
        pagination: {
          currentPage: page,
          totalPages,
          totalServices,
          servicesPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }

  async getServiceById(id: string, userId: string) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      const service = await prismaClient.service.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!service) {
        throw new Error("Servicio no encontrado o no tienes permisos para verlo");
      }

      return {
        status: 200,
        message: "Servicio encontrado",
        data: service,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }

  async updateService(id: string, name: string, duration: string, price: number, categoryId: string, userId: string) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      // Verificar que el servicio pertenece a la organización del usuario
      const service = await prismaClient.service.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!service) {
        throw new Error("Servicio no encontrado o no tienes permisos para editarlo");
      }

      // Verificar que la categoría pertenece a la organización del usuario
      const category = await prismaClient.category.findFirst({
        where: {
          id: categoryId,
          organizationId: membership.organization.id,
        },
      });

      if (!category) {
        throw new Error("Categoría no encontrada o no tienes permisos para usarla");
      }

      const updatedService = await prismaClient.service.update({
        where: {
          id,
        },
        data: {
          name,
          duration,
          price,
          categoryId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: "Servicio actualizado exitosamente",
        data: updatedService,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }

  async deleteService(id: string, userId: string) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] }
        },
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      // Verificar que el servicio pertenece a la organización del usuario
      const service = await prismaClient.service.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!service) {
        throw new Error("Servicio no encontrado o no tienes permisos para eliminarlo");
      }

      await prismaClient.service.delete({
        where: {
          id,
        },
      });

      return {
        status: 200,
        message: "Servicio eliminado exitosamente",
        data: null,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }
}