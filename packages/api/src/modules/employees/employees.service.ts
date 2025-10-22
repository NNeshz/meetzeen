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

  async listEmployeeSchedules(employeeId: string, userId: string) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para verlo");

      const schedules = await prismaClient.employeeSchedule.findMany({
        where: { employeeId },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });

      return { status: 200, message: "Horarios del empleado", data: schedules };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
    }
  }

  async createEmployeeScheduleEntry(
    employeeId: string,
    userId: string,
    entry: { dayOfWeek: number; startTime: string; endTime: string; order?: number; isActive?: boolean }
  ) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para editarlo");

      const normalized = {
        dayOfWeek: entry.dayOfWeek === 0 ? 7 : entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
      };
      if (!this.isValidScheduleEntry(normalized)) {
        throw new Error("Horario inválido: formato HH:mm y start < end.");
      }

      const created = await prismaClient.employeeSchedule.create({
        data: {
          employeeId,
          dayOfWeek: normalized.dayOfWeek,
          startTime: normalized.startTime,
          endTime: normalized.endTime,
          order: entry.order ?? 1,
          isActive: entry.isActive ?? true,
        },
      });

      return { status: 201, message: "Horario creado", data: created };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
    }
  }

  async updateEmployeeScheduleEntry(
    employeeId: string,
    scheduleId: string,
    userId: string,
    update: { dayOfWeek?: number; startTime?: string; endTime?: string; order?: number; isActive?: boolean }
  ) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para editarlo");

      const existing = await prismaClient.employeeSchedule.findFirst({
        where: { id: scheduleId, employeeId },
      });
      if (!existing) throw new Error("Horario no encontrado para este empleado");

      const candidate = {
        dayOfWeek: update.dayOfWeek !== undefined
          ? (update.dayOfWeek === 0 ? 7 : update.dayOfWeek)
          : existing.dayOfWeek,
        startTime: update.startTime ?? existing.startTime,
        endTime: update.endTime ?? existing.endTime,
      };
      if (!this.isValidScheduleEntry(candidate)) {
        throw new Error("Horario inválido: formato HH:mm y start < end.");
      }

      const updated = await prismaClient.employeeSchedule.update({
        where: { id: scheduleId },
        data: {
          dayOfWeek: candidate.dayOfWeek,
          startTime: candidate.startTime,
          endTime: candidate.endTime,
          ...(update.order !== undefined && { order: update.order }),
          ...(update.isActive !== undefined && { isActive: update.isActive }),
        },
      });

      return { status: 200, message: "Horario actualizado", data: updated };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
    }
  }

  async deleteEmployeeScheduleEntry(employeeId: string, scheduleId: string, userId: string) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para editarlo");

      await prismaClient.employeeSchedule.delete({
        where: { id: scheduleId },
      });

      return { status: 200, message: "Horario eliminado", data: null };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
    }
  }

  async replaceEmployeeDaySchedules(
    employeeId: string,
    dayOfWeek: number,
    entries: Array<{ startTime: string; endTime: string; order?: number; isActive?: boolean }>,
    userId: string
  ) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para editarlo");

      const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

      const validEntries = entries
        .map((e) => ({ dayOfWeek: normalizedDay, startTime: e.startTime, endTime: e.endTime }))
        .filter((e) => this.isValidScheduleEntry(e));

      if (validEntries.length !== entries.length) {
        throw new Error("Una o más entradas son inválidas: formato HH:mm y start < end.");
      }

      await prismaClient.$transaction(async (tx) => {
        await tx.employeeSchedule.deleteMany({ where: { employeeId, dayOfWeek: normalizedDay } });
        if (entries.length > 0) {
          await tx.employeeSchedule.createMany({
            data: entries.map((e) => ({
              employeeId,
              dayOfWeek: normalizedDay,
              startTime: e.startTime,
              endTime: e.endTime,
              order: e.order ?? 1,
              isActive: e.isActive ?? true,
            })),
          });
        }
      });

      return { status: 200, message: "Horarios del día reemplazados", data: null };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
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

      // Cargar overrides por fecha en el rango y priorizarlos sobre horarios base
      const startDateISO = new Date(`${rangeStart.toString()}T00:00:00.000Z`);
      const endDateISO = new Date(`${rangeEnd.toString()}T00:00:00.000Z`);
      const overrides = await prismaClient.employeeScheduleOverride.findMany({
        where: {
          employeeId,
          date: { gte: startDateISO, lte: endDateISO },
          isActive: true,
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });

      const overrideMap: Record<string, { startTime: string; endTime: string }[]> = {};
      for (const o of overrides) {
        const ymd = o.date.toISOString().split("T")[0]!;
        (overrideMap[ymd] ??= []).push({ startTime: o.startTime, endTime: o.endTime });
      }

      const availability: {
        date: string;
        dayOfWeek: number;
        slots: { startTime: string; endTime: string }[];
      }[] = [];

      let pd = rangeStart;
      while (Temporal.PlainDate.compare(pd, rangeEnd) <= 0) {
        const ymd = pd.toString(); // YYYY-MM-DD
        const dow = pd.dayOfWeek; // 1..7 (lunes..domingo)

        const overrideSlots = overrideMap[ymd];
        const baseSlots = map[dow];

        if (overrideSlots && overrideSlots.length > 0) {
          availability.push({ date: ymd, dayOfWeek: dow, slots: overrideSlots });
        } else if (baseSlots && baseSlots.length > 0) {
          availability.push({ date: ymd, dayOfWeek: dow, slots: baseSlots });
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

  async conditionalUpdateEmployeeSchedules(
    employeeId: string,
    payload: {
      selectedDate?: string; // YYYY-MM-DD
      schedules: Array<{ startTime: string; endTime: string; order?: number; isActive?: boolean }>;
      onlyThisDay?: boolean;
      repeatWeeks?: number;
    },
    userId: string
  ) {
    try {
      const membership = await prismaClient.member.findFirst({
        where: { userId, role: { in: ["owner", "member"] } },
        include: { organization: { select: { id: true } } },
      });
      if (!membership) throw new Error("El usuario no pertenece a ninguna organización");

      const employee = await prismaClient.employee.findFirst({
        where: { id: employeeId, organizationId: membership.organization.id },
      });
      if (!employee) throw new Error("Empleado no encontrado o no tienes permisos para editarlo");

      // Validar horarios
      for (const s of payload.schedules) {
        if (!this.isValidTime(s.startTime) || !this.isValidTime(s.endTime) || s.startTime >= s.endTime) {
          throw new Error("Horario inválido: formato HH:mm y start < end.");
        }
      }

      const onlyThisDay = payload.onlyThisDay === true;
      const repeatCount = typeof payload.repeatWeeks === "number" ? Math.max(1, payload.repeatWeeks) : 0;

      if (onlyThisDay || repeatCount > 0) {
        if (!payload.selectedDate) {
          throw new Error("selectedDate es requerido para actualizar solo ese día o repetir.");
        }

        // Construir fechas objetivo: solo la fecha seleccionada o repetir semanalmente N semanas
        const basePD = Temporal.PlainDate.from(payload.selectedDate);
        const targetDates: Date[] = [];

        if (onlyThisDay) {
          targetDates.push(new Date(`${basePD.toString()}T00:00:00.000Z`));
        }
        if (repeatCount > 0) {
          for (let i = 0; i < repeatCount; i++) {
            const pd = basePD.add({ weeks: i });
            targetDates.push(new Date(`${pd.toString()}T00:00:00.000Z`));
          }
        }

        await prismaClient.$transaction(async (tx) => {
          // Eliminar overrides existentes para esas fechas
          await tx.employeeScheduleOverride.deleteMany({
            where: { employeeId, date: { in: targetDates } },
          });

          // Crear overrides por cada fecha indicada
          if (payload.schedules.length > 0) {
            await tx.employeeScheduleOverride.createMany({
              data: targetDates.flatMap((d) =>
                payload.schedules.map((s) => ({
                  employeeId,
                  date: d,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  order: s.order ?? 1,
                  isActive: s.isActive ?? true,
                }))
              ),
            });
          }
        });

        return {
          status: 200,
          message:
            repeatCount > 0
              ? "Horarios aplicados como overrides en las fechas seleccionadas por las próximas semanas."
              : "Horarios aplicados como override solo para la fecha seleccionada.",
          data: null,
        };
      }

      // Sin opciones -> aplicar a TODOS los días (1–7)
      const allDaysEntries: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
      for (let d = 1; d <= 7; d++) {
        for (const s of payload.schedules) {
          allDaysEntries.push({
            dayOfWeek: d,
            startTime: s.startTime,
            endTime: s.endTime,
          });
        }
      }

      return this.updateEmployeeSchedule(employeeId, allDaysEntries, userId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      return { status: 500, message: msg, data: null };
    }
  }
}
