import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";
import { EmployeesFilters } from "@meetzeen/api/src/modules/employees/employees.route";

export class EmployeesService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async createEmployee(
    body: {
      name: string;
      phoneNumber: string;
      email: string;
      image?: File | null;
      categoryIds: string[];
    },
    userId: string
  ) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
        },
        include: {
          organization: {
            select: {
              id: true,
              workDays: true,
              startHour: true,
              startMinute: true,
              startAmPm: true,
              endHour: true,
              endMinute: true,
              endAmPm: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      // Verificar que las categorías pertenecen a la organización
      const categories = await prismaClient.category.findMany({
        where: {
          id: { in: body.categoryIds },
          organizationId: membership.organization.id,
        },
      });

      if (categories.length !== body.categoryIds.length) {
        throw new Error("Una o más categorías no pertenecen a tu organización");
      }

      let imageUrl: string | null = null;

      // Procesar imagen si existe
      if (body.image) {
        imageUrl = await this.imageService.createImage(body.image, "employees");
      }

      // Crear empleado
      const employee = await prismaClient.employee.create({
        data: {
          name: body.name,
          phoneNumber: body.phoneNumber,
          email: body.email,
          imageUrl: imageUrl,
          organizationId: membership.organization.id,
          categories: {
            connect: body.categoryIds.map((id) => ({ id })),
          },
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await this.inheritOrganizationSchedule(
        employee.id,
        membership.organization
      );

      return {
        status: 201,
        message: "Empleado creado con éxito",
        data: employee,
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

  private async inheritOrganizationSchedule(
    employeeId: string,
    organization: {
      workDays: string[];
      startHour: string | null;
      startMinute: string | null;
      startAmPm: string | null;
      endHour: string | null;
      endMinute: string | null;
      endAmPm: string | null;
    }
  ) {
    if (!organization.startHour || !organization.endHour) {
      return;
    }

    const startTime = this.convertTo24HourFormat(
      organization.startHour,
      organization.startMinute || "00",
      organization.startAmPm || "AM"
    );

    const endTime = this.convertTo24HourFormat(
      organization.endHour,
      organization.endMinute || "00",
      organization.endAmPm || "PM"
    );

    const dayMapping: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const schedules = organization.workDays.map((day) => {
      const dayOfWeek = dayMapping[day.toLowerCase()];
      if (dayOfWeek === undefined) {
        throw new Error(`Día de la semana no válido: ${day}`);
      }

      return {
        employeeId,
        dayOfWeek,
        startTime,
        endTime,
      };
    });

    try {
      await prismaClient.employeeSchedule.createMany({
        data: schedules,
      });
      console.log("✅ Horarios creados exitosamente");
    } catch (error) {
      console.error("❌ Error al crear horarios:", error);
      throw error;
    }
  }

  // Agregar este método helper
  private convertTo24HourFormat(
    hour: string,
    minute: string,
    ampm: string
  ): string {
    let hourNum = parseInt(hour);
    const minuteStr = minute.padStart(2, "0");

    if (ampm.toUpperCase() === "PM" && hourNum !== 12) {
      hourNum += 12;
    } else if (ampm.toUpperCase() === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, "0")}:${minuteStr}`;
  }

  async listEmployees(filters: EmployeesFilters, userId: string) {
    try {
      const page = filters.page ?? 1;
      const limit = 12;
      const offset = (page - 1) * limit;

      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
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
          categories: {
            some: {
              id: filters.categoryId,
            },
          },
        }),
      };

      const [totalEmployees, employees] = await Promise.all([
        prismaClient.employee.count({ where }),
        prismaClient.employee.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: offset,
          take: limit,
          select: {
            id: true,
            imageUrl: true,
            name: true,
            phoneNumber: true,
            email: true,
            createdAt: true,
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalEmployees / limit);

      return {
        status: 200,
        message: "Empleados listados",
        data: employees,
        count: employees.length,
        filters,
        pagination: {
          currentPage: page,
          totalPages,
          totalEmployees,
          employeesPerPage: limit,
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

  async updateEmployee(
    id: string,
    body: {
      name?: string;
      phoneNumber?: string;
      email?: string;
      image?: File | string | null;
      categoryIds?: string[];
      hasImageChanged?: boolean;
    },
    userId: string
  ) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
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

      // Verificar que el empleado pertenece a la organización
      const employee = await prismaClient.employee.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!employee) {
        throw new Error(
          "Empleado no encontrado o no tienes permisos para editarlo"
        );
      }

      // Verificar categorías si se proporcionan
      if (body.categoryIds) {
        const categories = await prismaClient.category.findMany({
          where: {
            id: { in: body.categoryIds },
            organizationId: membership.organization.id,
          },
        });

        if (categories.length !== body.categoryIds.length) {
          throw new Error(
            "Una o más categorías no pertenecen a tu organización"
          );
        }
      }

      let imageUrl = employee.imageUrl;

      // Manejar imagen
      if (body.hasImageChanged) {
        if (employee.imageUrl) {
          try {
            await this.imageService.deleteImage(employee.imageUrl);
          } catch (error) {
            console.warn("Error al eliminar imagen anterior:", error);
          }
        }

        if (body.image && typeof body.image !== "string") {
          imageUrl = await this.imageService.createImage(
            body.image,
            "employees"
          );
        } else {
          imageUrl = null;
        }
      }

      const updateData: any = {
        ...(body.name && { name: body.name }),
        ...(body.phoneNumber && { phoneNumber: body.phoneNumber }),
        ...(body.email && { email: body.email }),
        ...(body.hasImageChanged && { imageUrl }),
      };

      // Actualizar categorías si se proporcionan
      if (body.categoryIds) {
        updateData.categories = {
          set: body.categoryIds.map((id) => ({ id })),
        };
      }

      const updatedEmployee = await prismaClient.employee.update({
        where: { id },
        data: updateData,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: "Empleado actualizado con éxito",
        data: updatedEmployee,
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

  async deleteEmployee(id: string, userId: string) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
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

      // Verificar que el empleado pertenece a la organización
      const employee = await prismaClient.employee.findFirst({
        where: {
          id,
          organizationId: membership.organization.id,
        },
      });

      if (!employee) {
        throw new Error(
          "Empleado no encontrado o no tienes permisos para eliminarlo"
        );
      }

      // Eliminar imagen si existe
      if (employee.imageUrl) {
        try {
          await this.imageService.deleteImage(employee.imageUrl);
        } catch (error) {
          console.warn("Error al eliminar imagen:", error);
        }
      }

      await prismaClient.employee.delete({
        where: { id },
      });

      return {
        status: 200,
        message: "Empleado eliminado con éxito",
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

  async updateEmployeeSchedule(
    employeeId: string,
    schedules: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[],
    userId: string
  ) {
    try {
      // Buscar la organización donde el usuario es member
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
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

      // Verificar que el empleado pertenece a la organización
      const employee = await prismaClient.employee.findFirst({
        where: {
          id: employeeId,
          organizationId: membership.organization.id,
        },
      });

      if (!employee) {
        throw new Error(
          "Empleado no encontrado o no tienes permisos para editarlo"
        );
      }

      // Eliminar horarios existentes
      await prismaClient.employeeSchedule.deleteMany({
        where: { employeeId },
      });

      // Crear nuevos horarios
      if (schedules.length > 0) {
        await prismaClient.employeeSchedule.createMany({
          data: schedules.map((schedule) => ({
            employeeId,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })),
        });
      }

      return {
        status: 200,
        message: "Horario del empleado actualizado con éxito",
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
