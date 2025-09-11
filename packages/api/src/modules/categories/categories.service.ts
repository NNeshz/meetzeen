import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { CategoriesFilters } from "@meetzeen/api/src/modules/categories/categories.route";

export class CategoriesService {
  constructor() {}

  async createCategory(name: string, userId: string) {
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

      await prismaClient.category.create({
        data: {
          name,
          organizationId: membership.organization.id,
        },
      });

      return {
        status: 200,
        message: "Categoría creada",
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

  async listCategories(filters: CategoriesFilters, userId: string) {
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
      };

      const [totalCategories, categories] = await Promise.all([
        prismaClient.category.count({ where }),
        prismaClient.category.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: limit,
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCategories / limit);

      return {
        status: 200,
        message: "Categorías listadas",
        data: categories,
        count: categories.length,
        filters,
        pagination: {
          currentPage: page,
          totalPages,
          totalCategories,
          categoriesPerPage: limit,
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

  async updateCategory(id: string, name: string, userId: string) {
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

      // Verificar que la categoría pertenece a la organización del usuario
      const category = await prismaClient.category.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!category) {
        throw new Error("Categoría no encontrada o no tienes permisos para editarla");
      }

      await prismaClient.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return {
        status: 200,
        message: "Categoría actualizada",
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

  async deleteCategory(id: string, userId: string) {
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

      // Verificar que la categoría pertenece a la organización del usuario
      const category = await prismaClient.category.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!category) {
        throw new Error("Categoría no encontrada o no tienes permisos para eliminarla");
      }

      await prismaClient.category.delete({
        where: {
          id,
        },
      });

      return {
        status: 200,
        message: "Categoría eliminada",
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
