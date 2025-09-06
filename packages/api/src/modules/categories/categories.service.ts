import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { CategoriesFilters } from "@meetzeen/api/src/modules/categories/categories.route";

export class CategoriesService {
  constructor() {}

  async createCategory(name: string, userId: string) {
    try {
      const company = await prismaClient.company.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        throw new Error("El usuario no tiene una empresa");
      }

      await prismaClient.category.create({
        data: {
          name,
          companyId: company.id,
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
      const limit = 12
      const offset = (page - 1) * limit;

      const company = await prismaClient.company.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        throw new Error("El usuario no tiene una empresa");
      }

      const where: any = {
        ...(filters.search && {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        }),
      }

      const [totalCategories, categories] = await Promise.all([
        prismaClient.category.count({ where }),
        prismaClient.category.findMany({
          where: {
            companyId: company.id,
            ...where,
          },
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
          }
        }),
      ])

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
      const company = await prismaClient.company.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        throw new Error("El usuario no tiene una empresa");
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
      const company = await prismaClient.company.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        throw new Error("El usuario no tiene una empresa");
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
