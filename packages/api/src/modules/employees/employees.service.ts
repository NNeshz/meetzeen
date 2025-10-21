import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { ImageService } from "@meetzeen/api/src/modules/images";
import { EmployeesFilters } from "@meetzeen/api/src/modules/employees/employees.route";
import { Temporal } from "temporal-polyfill";

type DayKey =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

type ScheduleByDay = Partial<Record<DayKey, { start: string; end: string }[]>>;
type ScheduleArray = Array<{
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}>;

const DAY_TO_INDEX: Record<DayKey, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 7,
};

const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class EmployeesService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }
  private isValidTime(t: string): boolean {
    return TIME_24H_REGEX.test(t);
  }

  private isValidScheduleEntry(e: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }): boolean {
    return (
      e.dayOfWeek >= 1 &&
      e.dayOfWeek <= 7 &&
      this.isValidTime(e.startTime) &&
      this.isValidTime(e.endTime) &&
      e.startTime < e.endTime
    );
  }

  private normalizeSchedules(
    schedules?: ScheduleByDay | ScheduleArray
  ): ScheduleArray {
    if (!schedules) return [];
    if (Array.isArray(schedules)) {
      return schedules.filter((e) => this.isValidScheduleEntry(e));
    }
    const entries: ScheduleArray = [];
    (Object.keys(schedules) as DayKey[]).forEach((day) => {
      const shifts = schedules[day] ?? [];

      shifts.forEach((s) => {
        const startTime = s.start;
        const endTime = s.end;
        if (
          this.isValidTime(startTime) &&
          this.isValidTime(endTime) &&
          startTime < endTime
        ) {
          const entry = {
            dayOfWeek: DAY_TO_INDEX[day],
            startTime,
            endTime,
          };
          entries.push(entry);
        }
      });
    });

    return entries;
  }

  private formatDate(date: Date): string {
    // Asegurar que usamos la fecha local sin conversión de zona horaria
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  private getDayIndex(date: Date): number {
    const d = date.getDay(); // 0=domingo ... 6=sábado
    return d === 0 ? 7 : d; // 1=lunes ... 7=domingo
  }

  async createEmployee(
    body: {
      name: string;
      phoneNumber: string;
      email: string;
      image?: File | null;
      categoryIds: string[];
      // NUEVO: horarios en formato por día o como array
      schedules?: ScheduleByDay | ScheduleArray;
    },
    userId: string
  ) {
    try {
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

      const categories = await prismaClient.category.findMany({
        where: {
          id: { in: body.categoryIds },
          organizationId: membership.organization.id,
        },
      });

      if (categories.length !== body.categoryIds.length) {
        throw new Error("Una o más categorías no pertenecen a tu organización");
      }

      // Validación y normalización de horarios
      const normalizedSchedules = this.normalizeSchedules(body.schedules);

      if (normalizedSchedules.length === 0) {
        throw new Error("Debes asignar al menos un turno (formato 24h HH:mm).");
      }

      let imageUrl: string | null = null;
      if (body.image) {
        imageUrl = await this.imageService.createImage(body.image, "employees");
      }

      // Crear empleado y horarios en una transacción
      const employee = await prismaClient.$transaction(async (tx) => {
        const created = await tx.employee.create({
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

        await tx.employeeSchedule.createMany({
          data: normalizedSchedules.map((s) => ({
            employeeId: created.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        });

        return created;
      });

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

      // Normalizar a 1–7 y filtrar entradas inválidas antes de crear
      const normalized = schedules
        .map((s) => ({
          dayOfWeek: s.dayOfWeek === 0 ? 7 : s.dayOfWeek, // si llega 0, convertir a 7 (domingo)
          startTime: s.startTime,
          endTime: s.endTime,
        }))
        .filter((s) => this.isValidScheduleEntry(s));

      // Crear nuevos horarios
      if (normalized.length > 0) {
        await prismaClient.employeeSchedule.createMany({
          data: normalized.map((schedule) => ({
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

  async getEmployeeAvailability(
    employeeId: string,
    userId: string,
    options?: { startDate?: string; endDate?: string; monthsAhead?: number }
  ) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: {
          userId,
          role: { in: ["owner", "member"] },
        },
        include: {
          organization: {
            select: {
              id: true,
              timezone: true,
            },
          },
        },
      });

      if (!membership) {
        throw new Error("El usuario no pertenece a ninguna organización");
      }

      const employee = await prismaClient.employee.findFirst({
        where: {
          id: employeeId,
          organizationId: membership.organization.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          imageUrl: true,
          categories: {
            select: { id: true, name: true },
          },
        },
      });

      if (!employee) {
        throw new Error(
          "Empleado no encontrado o no tienes permisos para verlo"
        );
      }

      const schedules = await prismaClient.employeeSchedule.findMany({
        where: { employeeId },
        orderBy: { dayOfWeek: "asc" },
      });

      const map: Record<number, { startTime: string; endTime: string }[]> = {};
      for (const s of schedules) {
        if (!map[s.dayOfWeek]) map[s.dayOfWeek] = [];
        (map[s.dayOfWeek] ??= []).push({
          startTime: s.startTime,
          endTime: s.endTime,
        });
      }

      const tz = membership.organization.timezone ?? Temporal.Now.timeZoneId();

      function toPlainDate(input?: string): Temporal.PlainDate {
        if (!input) return Temporal.Now.zonedDateTimeISO(tz).toPlainDate();
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
          return Temporal.PlainDate.from(input);
        }
        const inst = Temporal.Instant.from(input);
        return inst.toZonedDateTimeISO(tz).toPlainDate();
      }

      const startPD = toPlainDate(options?.startDate);
      const endPD = options?.endDate
        ? toPlainDate(options.endDate)
        : startPD.add({ months: options?.monthsAhead ?? 6 });

      const startCmp = Temporal.PlainDate.compare(startPD, endPD);
      const rangeStart = startCmp <= 0 ? startPD : endPD;
      const rangeEnd = startCmp <= 0 ? endPD : startPD;

      const availability: {
        date: string;
        dayOfWeek: number;
        slots: { startTime: string; endTime: string }[];
      }[] = [];

      let pd = rangeStart;
      while (Temporal.PlainDate.compare(pd, rangeEnd) <= 0) {
        const dow = pd.dayOfWeek; // 1=lunes ... 7=domingo
        const slots = map[dow];
        if (slots && slots.length > 0) {
          availability.push({
            date: pd.toString(), // YYYY-MM-DD ISO 8601
            dayOfWeek: dow,
            slots,
          });
        }
        pd = pd.add({ days: 1 });
      }

      return {
        status: 200,
        message: "Disponibilidad del empleado",
        data: {
          employee,
          range: {
            startDate: rangeStart.toString(),
            endDate: rangeEnd.toString(),
          },
          availability,
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
}
