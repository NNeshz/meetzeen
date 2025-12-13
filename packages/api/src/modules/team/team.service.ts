import {
  dailyAvailability,
  db,
  member,
  user,
  weeklyScheduleTemplate,
  scheduleGenerationLog,
  organization,
} from "@meetzeen/database";
import { eq, inArray, and, gte, sql, lte } from "drizzle-orm";
import { TimeBlock } from "@meetzeen/api/src/modules/team/types/team.types";

export class TeamService {
  constructor() {}

  async getTeam(organizationId: string) {
    const team = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
    });

    const userIds = team.map((member) => member.userId);
    const users = await db.query.user.findMany({
      where: inArray(user.id, userIds),
    });

    const teamWithRoles = users.map((user) => ({
      image: user.image,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: team.find((m) => m.userId === user.id)?.role,
      id: user.id,
    }));

    return teamWithRoles;
  }

  async getCalendar(
    userId: string,
    organizationId: string,
    startDate: string,
    endDate: string,
    timezone?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);

    let tz = timezone;
    if (!tz) {
      const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
        columns: { timezone: true },
      });
      tz = org?.timezone || "UTC";
    }

    await this.ensureAvailabilitiesGenerated(
      memberRecord.id,
      startDate,
      endDate,
      tz
    );

    const [availabilitiesRaw, template] = await Promise.all([
      db
        .select({
          id: dailyAvailability.id,
          date: dailyAvailability.date,
          timeBlocks: dailyAvailability.timeBlocks,
          isWorkingDay: dailyAvailability.isWorkingDay,
          source: dailyAvailability.source,
        })
        .from(dailyAvailability)
        .where(
          and(
            eq(dailyAvailability.memberId, memberRecord.id),
            gte(dailyAvailability.date, startDate),
            lte(dailyAvailability.date, endDate)
          )
        )
        .orderBy(dailyAvailability.date),
      db
        .select({
          id: weeklyScheduleTemplate.id,
          dayOfWeek: weeklyScheduleTemplate.dayOfWeek,
          timeBlocks: weeklyScheduleTemplate.timeBlocks,
        })
        .from(weeklyScheduleTemplate)
        .where(
          and(
            eq(weeklyScheduleTemplate.memberId, memberRecord.id),
            eq(weeklyScheduleTemplate.isActive, true)
          )
        ),
    ]);

    const availabilities = availabilitiesRaw.map((day) => ({
      ...day,
      date: `Date:${day.date}`,
    }));

    return {
      days: availabilities,
      template,
    };
  }

  async updateWeeklyTemplate(
    memberId: string,
    organizationId: string,
    dayOfWeek: number,
    timeBlocks: TimeBlock[]
  ) {
    const memberRecord = await this.getMember(memberId, organizationId);
    this.validateTimeBlocks(timeBlocks);

    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
      columns: { timezone: true },
    });
    const tz = org?.timezone || "UTC";

    await db
      .update(weeklyScheduleTemplate)
      .set({ isActive: false })
      .where(
        and(
          eq(weeklyScheduleTemplate.memberId, memberRecord.id),
          eq(weeklyScheduleTemplate.dayOfWeek, dayOfWeek),
          eq(weeklyScheduleTemplate.isActive, true)
        )
      );

    await db.insert(weeklyScheduleTemplate).values({
      memberId: memberRecord.id,
      dayOfWeek,
      timeBlocks,
      isActive: true,
    });

    const todayInTz = this.getTodayInTimezone(tz);

    const startDate = this.addDays(todayInTz, -3);
    const endDate = this.addDays(todayInTz, 120);

    await this.regenerateFutureAvailabilities(
      memberRecord.id,
      startDate,
      endDate,
      tz
    );

    return { success: true };
  }

  async setDayAvailability(
    userId: string,
    organizationId: string,
    date: string,
    timeBlocks: TimeBlock[],
    reason?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);
    this.validateTimeBlocks(timeBlocks);

    await this.upsertDailyAvailability(
      memberRecord.id,
      date,
      timeBlocks,
      "custom",
      reason
    );

    return { success: true };
  }

  // Ruta unificada para actualizar horarios
  async updateSchedule(
    userId: string,
    organizationId: string,
    action: "solo-este-dia" | "repetir" | "vacaciones" | "para-siempre",
    date: string,
    timeBlocks: TimeBlock[],
    repeatCount?: number,
    reason?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);

    // Validar timeBlocks solo si no es vacaciones
    if (action !== "vacaciones") {
      this.validateTimeBlocks(timeBlocks);
    }

    switch (action) {
      case "solo-este-dia": {
        await this.upsertDailyAvailability(
          memberRecord.id,
          date,
          timeBlocks,
          "custom",
          reason
        );
        return { success: true, action, dates: [date] };
      }

      case "repetir": {
        const count = repeatCount || 2;
        if (count < 2 || count > 8) {
          throw new Error("El número de repeticiones debe estar entre 2 y 8");
        }

        const dates = this.calculateRepeatDates(date, count);
        
        for (const d of dates) {
          await this.upsertDailyAvailability(
            memberRecord.id,
            d,
            timeBlocks,
            "custom",
            reason
          );
        }
        
        return { success: true, action, dates };
      }

      case "vacaciones": {
        await this.upsertDailyAvailability(
          memberRecord.id,
          date,
          [],
          "exception",
          reason || "Vacaciones / Día no disponible"
        );
        return { success: true, action, dates: [date] };
      }

      case "para-siempre": {
        // Obtener el día de la semana
        const [year, month, day] = date.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayOfWeek = dateObj.getDay();

        // Actualizar el template semanal
        await this.updateWeeklyTemplate(
          userId,
          organizationId,
          dayOfWeek,
          timeBlocks
        );

        return { success: true, action, dayOfWeek };
      }

      default:
        throw new Error("Acción no válida");
    }
  }

  // Helper para calcular fechas de repetición
  private calculateRepeatDates(startDate: string, count: number): string[] {
    const dates: string[] = [];
    const [year, month, day] = startDate.split("-").map(Number);
    const baseDate = new Date(year, month - 1, day, 12, 0, 0);

    for (let i = 0; i < count; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i * 7);

      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${d}`);
    }

    return dates;
  }

  // Helper para insertar o actualizar disponibilidad diaria
  private async upsertDailyAvailability(
    memberId: string,
    date: string,
    timeBlocks: TimeBlock[],
    source: "template" | "custom" | "exception",
    reason?: string
  ) {
    // Buscar si ya existe
    const existing = await db.query.dailyAvailability.findFirst({
      where: and(
        eq(dailyAvailability.memberId, memberId),
        eq(dailyAvailability.date, date)
      ),
    });

    if (existing) {
      // Actualizar
      await db
        .update(dailyAvailability)
        .set({
          timeBlocks,
          isWorkingDay: timeBlocks.length > 0,
          source,
          reason,
          updatedAt: sql`NOW()`,
        })
        .where(eq(dailyAvailability.id, existing.id));
    } else {
      // Insertar
      await db.insert(dailyAvailability).values({
        memberId,
        date,
        timeBlocks,
        isWorkingDay: timeBlocks.length > 0,
        source,
        reason,
      });
    }
  }

  async setDaysOff(
    userId: string,
    organizationId: string,
    startDate: string,
    endDate: string,
    reason?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);

    const dates = this.generateDateRange(startDate, endDate);

    for (const date of dates) {
      await db
        .insert(dailyAvailability)
        .values({
          memberId: memberRecord.id,
          date,
          timeBlocks: [],
          isWorkingDay: false,
          source: "exception",
          reason,
        })
        .onConflictDoUpdate({
          target: [dailyAvailability.memberId, dailyAvailability.date],
          set: {
            timeBlocks: [],
            isWorkingDay: false,
            source: "exception",
            reason,
            updatedAt: sql`NOW()`,
          },
        });
    }

    return { success: true };
  }

  async setMultipleDaysAvailability(
    userId: string,
    organizationId: string,
    dates: string[],
    timeBlocks: TimeBlock[],
    reason?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);
    this.validateTimeBlocks(timeBlocks);

    for (const date of dates) {
      await db
        .insert(dailyAvailability)
        .values({
          memberId: memberRecord.id,
          date,
          timeBlocks,
          isWorkingDay: timeBlocks.length > 0,
          source: "custom",
          reason,
        })
        .onConflictDoUpdate({
          target: [dailyAvailability.memberId, dailyAvailability.date],
          set: {
            timeBlocks,
            isWorkingDay: timeBlocks.length > 0,
            source: "custom",
            reason,
            updatedAt: sql`NOW()`,
          },
        });
    }

    return { success: true };
  }

  async setRepeatSchedule(
    userId: string,
    organizationId: string,
    startDate: string,
    repeatCount: number,
    timeBlocks: TimeBlock[],
    reason?: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);
    this.validateTimeBlocks(timeBlocks);

    // Validar límites de repetición (2-8)
    if (repeatCount < 2 || repeatCount > 8) {
      throw new Error("El número de repeticiones debe estar entre 2 y 8");
    }

    // Calcular las fechas de repetición (cada 7 días)
    const dates: string[] = [];
    const [year, month, day] = startDate.split("-").map(Number);
    const baseDate = new Date(year, month - 1, day, 12, 0, 0);

    for (let i = 0; i < repeatCount; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i * 7);

      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${d}`);
    }

    // Insertar/actualizar cada fecha
    for (const date of dates) {
      await db
        .insert(dailyAvailability)
        .values({
          memberId: memberRecord.id,
          date,
          timeBlocks,
          isWorkingDay: timeBlocks.length > 0,
          source: "custom",
          reason,
        })
        .onConflictDoUpdate({
          target: [dailyAvailability.memberId, dailyAvailability.date],
          set: {
            timeBlocks,
            isWorkingDay: timeBlocks.length > 0,
            source: "custom",
            reason,
            updatedAt: sql`NOW()`,
          },
        });
    }

    return { success: true, dates };
  }

  async removeDayException(
    userId: string,
    organizationId: string,
    date: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);

    await db
      .delete(dailyAvailability)
      .where(
        and(
          eq(dailyAvailability.memberId, memberRecord.id),
          eq(dailyAvailability.date, date),
          eq(dailyAvailability.source, "custom")
        )
      );

    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    const template = await db.query.weeklyScheduleTemplate.findFirst({
      where: and(
        eq(weeklyScheduleTemplate.memberId, memberRecord.id),
        eq(weeklyScheduleTemplate.dayOfWeek, dayOfWeek),
        eq(weeklyScheduleTemplate.isActive, true)
      ),
    });

    if (template) {
      await db.insert(dailyAvailability).values({
        memberId: memberRecord.id,
        date,
        timeBlocks: template.timeBlocks,
        isWorkingDay: template.timeBlocks.length > 0,
        source: "template",
      });
    }

    return { success: true };
  }

  async removeSchedule(
    userId: string,
    organizationId: string,
    date: string
  ) {
    const memberRecord = await this.getMember(userId, organizationId);

    // Obtener el día de la semana de la fecha proporcionada
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    // Obtener la zona horaria de la organización
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
      columns: { timezone: true },
    });
    const tz = org?.timezone || "UTC";

    // Desactivar el template semanal para ese día de la semana
    await db
      .update(weeklyScheduleTemplate)
      .set({ isActive: false })
      .where(
        and(
          eq(weeklyScheduleTemplate.memberId, memberRecord.id),
          eq(weeklyScheduleTemplate.dayOfWeek, dayOfWeek),
          eq(weeklyScheduleTemplate.isActive, true)
        )
      );

    // Calcular el rango de fechas
    const todayInTz = this.getTodayInTimezone(tz);
    const startDate = this.addDays(todayInTz, -3);
    const endDate = this.addDays(todayInTz, 120);

    // Obtener todas las disponibilidades del miembro en el rango
    const allAvailabilities = await db
      .select({
        id: dailyAvailability.id,
        date: dailyAvailability.date,
      })
      .from(dailyAvailability)
      .where(
        and(
          eq(dailyAvailability.memberId, memberRecord.id),
          gte(dailyAvailability.date, startDate),
          lte(dailyAvailability.date, endDate)
        )
      );

    // Filtrar las disponibilidades que corresponden al mismo día de la semana
    const availabilitiesToUpdate = allAvailabilities.filter((avail) => {
      const [y, m, d] = avail.date.split("-").map(Number);
      const availDate = new Date(y, m - 1, d, 12, 0, 0);
      return availDate.getDay() === dayOfWeek;
    });

    // ACTUALIZAR (no eliminar) las disponibilidades para que tengan horarios vacíos
    // Esto permite que el día siga visible en el calendario y se pueda volver a editar
    if (availabilitiesToUpdate.length > 0) {
      const idsToUpdate = availabilitiesToUpdate.map((a) => a.id);
      await db
        .update(dailyAvailability)
        .set({
          timeBlocks: [],
          isWorkingDay: false,
          source: "template",
          reason: null,
          updatedAt: sql`NOW()`,
        })
        .where(inArray(dailyAvailability.id, idsToUpdate));
    }

    return { success: true, dayOfWeek };
  }

  async createTemplate(
    memberId: string,
    organizationId: string,
    timeBlocks: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  ) {
    const memberRecord = await this.getMember(memberId, organizationId);

    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
      columns: { timezone: true },
    });
    const tz = org?.timezone || "UTC";

    for (const block of timeBlocks) {
      this.validateTimeBlocks([
        { startTime: block.startTime, endTime: block.endTime },
      ]);
    }

    const dayOfWeeks = timeBlocks.map((b) => b.dayOfWeek);
    await db
      .update(weeklyScheduleTemplate)
      .set({ isActive: false })
      .where(
        and(
          eq(weeklyScheduleTemplate.memberId, memberRecord.id),
          inArray(weeklyScheduleTemplate.dayOfWeek, dayOfWeeks),
          eq(weeklyScheduleTemplate.isActive, true)
        )
      );

    const templatesToInsert = timeBlocks.map((block) => ({
      memberId: memberRecord.id,
      dayOfWeek: block.dayOfWeek,
      timeBlocks: [{ startTime: block.startTime, endTime: block.endTime }],
      isActive: true,
    }));

    await db.insert(weeklyScheduleTemplate).values(templatesToInsert);

    const todayInTz = this.getTodayInTimezone(tz);

    const startDate = this.addDays(todayInTz, -3);
    const endDate = this.addDays(todayInTz, 120);

    await this.regenerateFutureAvailabilities(
      memberRecord.id,
      startDate,
      endDate,
      tz
    );

    return { success: true };
  }

  // =============================== Helpers ===============================

  private async getMember(memberId: string, organizationId: string) {
    const memeberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.userId, memberId),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!memeberRecord) throw new Error("Miembro no encontrado");
    return memeberRecord;
  }

  private validateTimeBlocks(timeBlocks: TimeBlock[]) {
    if (!timeBlocks || timeBlocks.length === 0) return;

    for (const block of timeBlocks) {
      const [sh, sm] = block.startTime.split(":").map(Number);
      const [eh, em] = block.endTime.split(":").map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        throw new Error(
          `Tiempos invalidos ${block.startTime} - ${block.endTime}`
        );
      }
    }

    // Revisar sobreposiciones
    for (let i = 0; i < timeBlocks.length; i++) {
      const [s1h, s1m] = timeBlocks[i].startTime.split(":").map(Number);
      const [e1h, e1m] = timeBlocks[i].endTime.split(":").map(Number);

      const start1 = s1h * 60 + s1m;
      const end1 = e1h * 60 + e1m;

      for (let j = i + 1; j < timeBlocks.length; j++) {
        const [s2h, s2m] = timeBlocks[j].startTime.split(":").map(Number);
        const [e2h, e2m] = timeBlocks[j].endTime.split(":").map(Number);
        const start2 = s2h * 60 + s2m;
        const end2 = e2h * 60 + e2m;

        if (start1 < end2 && end1 < start2) {
          throw new Error(
            `Tiempos invalidos ${timeBlocks[i].startTime} - ${timeBlocks[i].endTime}`
          );
        }
      }
    }
  }

  private async regenerateFutureAvailabilities(
    memberId: string,
    fromDate: string,
    toDate: string,
    timezone?: string
  ) {
    // Eliminar disponibilidad actual para este miembro en el rango especificado (solo las generadas por template)
    await db
      .delete(dailyAvailability)
      .where(
        and(
          eq(dailyAvailability.memberId, memberId),
          gte(dailyAvailability.date, fromDate),
          lte(dailyAvailability.date, toDate),
          eq(dailyAvailability.source, "template")
        )
      );

    // Regenerar disponibilidades en el rango especificado
    await this.generateAvailabilities(memberId, fromDate, toDate, timezone);

    // Actualizar o crear el log de generación
    const log = await db.query.scheduleGenerationLog.findFirst({
      where: eq(scheduleGenerationLog.memberId, memberId),
    });

    if (log) {
      // Parsear fechas para comparar
      const parseDate = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day, 12, 0, 0);
      };

      const fromDateObj = parseDate(fromDate);
      const toDateObj = parseDate(toDate);
      const logFromObj = parseDate(log.generatedFrom);
      const logUntilObj = parseDate(log.generatedUntil);

      const newFrom = fromDateObj < logFromObj ? fromDate : log.generatedFrom;
      const newUntil = toDateObj > logUntilObj ? toDate : log.generatedUntil;

      await db
        .update(scheduleGenerationLog)
        .set({
          generatedFrom: newFrom,
          generatedUntil: newUntil,
          updatedAt: sql`NOW()`,
        })
        .where(eq(scheduleGenerationLog.id, log.id));
    } else {
      await db.insert(scheduleGenerationLog).values({
        memberId,
        generatedFrom: fromDate,
        generatedUntil: toDate,
      });
    }
  }

  // Generar disponibilidad para un rango de fechas
  private async generateAvailabilities(
    memberId: string,
    startDate: string,
    endDate: string,
    timezone: string = "UTC"
  ) {
    const templates = await db
      .select()
      .from(weeklyScheduleTemplate)
      .where(
        and(
          eq(weeklyScheduleTemplate.memberId, memberId),
          eq(weeklyScheduleTemplate.isActive, true)
        )
      );

    const templateMap = new Map<number, TimeBlock[]>();
    for (const t of templates) {
      templateMap.set(t.dayOfWeek, t.timeBlocks);
    }

    const dates = this.generateDateRange(startDate, endDate);
    const availabilities = [];

    for (const date of dates) {
      // Calcular el día de la semana usando la zona horaria especificada
      // Formato esperado: "YYYY-MM-DD"
      const [year, month, day] = date.split("-").map(Number);

      // Crear una fecha en UTC (mediodía para evitar problemas de cambio de día)
      const dateInUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

      // Obtener el día de la semana en la zona horaria especificada
      // Usamos Intl.DateTimeFormat para obtener el nombre del día en esa zona horaria
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
      });
      const weekdayName = formatter.format(dateInUTC);

      // Convertir nombre del día a número (0=Sunday, 1=Monday, etc.)
      const weekdayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      };

      const dayOfWeek = weekdayMap[weekdayName] ?? dateInUTC.getUTCDay();
      const timeBlocks = templateMap.get(dayOfWeek) || [];

      availabilities.push({
        memberId,
        date,
        timeBlocks,
        isWorkingDay: timeBlocks.length > 0,
        source: "template" as const,
      });
    }

    // Insert en batch
    if (availabilities.length > 0) {
      await db
        .insert(dailyAvailability)
        .values(availabilities)
        .onConflictDoNothing(); // No sobrescribir excepciones existentes
    }
  }

  private generateDateRange(start: string, end: string): string[] {
    const dates: string[] = [];

    // Parsear fechas manualmente para evitar problemas de zona horaria
    const [startYear, startMonth, startDay] = start.split("-").map(Number);
    const [endYear, endMonth, endDay] = end.split("-").map(Number);

    // Crear fechas usando componentes locales (mediodía para evitar problemas de DST)
    let current = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);
    const endDate = new Date(endYear, endMonth - 1, endDay, 12, 0, 0);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private addDays(date: string, days: number): string {
    // Parsear fecha manualmente para evitar problemas de zona horaria
    const [year, month, day] = date.split("-").map(Number);
    const d = new Date(year, month - 1, day, 12, 0, 0);
    d.setDate(d.getDate() + days);

    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, "0");
    const newDay = String(d.getDate()).padStart(2, "0");
    return `${newYear}-${newMonth}-${newDay}`;
  }

  private getTodayInTimezone(timezone: string): string {
    // Obtener la fecha actual en la zona horaria especificada
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Intl.DateTimeFormat con "en-CA" devuelve formato YYYY-MM-DD
    return formatter.format(new Date());
  }

  private async ensureAvailabilitiesGenerated(
    memberId: string,
    startDate: string,
    endDate: string,
    timezone: string = "UTC"
  ) {
    // Verificar hasta dónde hemos generado
    const log = await db.query.scheduleGenerationLog.findFirst({
      where: eq(scheduleGenerationLog.memberId, memberId),
    });

    // Parsear fechas manualmente para comparaciones correctas
    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    };

    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    if (!log) {
      // Primera vez: generar desde startDate hasta endDate
      await this.generateAvailabilities(memberId, startDate, endDate, timezone);

      await db.insert(scheduleGenerationLog).values({
        memberId,
        generatedUntil: endDate,
        generatedFrom: startDate,
      });
      return;
    }

    const lastGeneratedUntil = log.generatedUntil;
    const lastGeneratedFrom = log.generatedFrom || lastGeneratedUntil;

    const lastGeneratedUntilObj = parseDate(lastGeneratedUntil);
    const lastGeneratedFromObj = parseDate(lastGeneratedFrom);

    // Si necesitamos generar hacia atrás (startDate < lastGeneratedFrom)
    if (startDateObj < lastGeneratedFromObj) {
      await this.generateAvailabilities(
        memberId,
        startDate,
        this.addDays(lastGeneratedFrom, -1),
        timezone
      );
    }

    // Si necesitamos generar hacia adelante (endDate > lastGeneratedUntil)
    if (endDateObj > lastGeneratedUntilObj) {
      await this.generateAvailabilities(
        memberId,
        this.addDays(lastGeneratedUntil, 1),
        endDate,
        timezone
      );
    }

    // Actualizar log con el rango más amplio generado
    const newGeneratedFrom =
      startDateObj < lastGeneratedFromObj ? startDate : lastGeneratedFrom;
    const newGeneratedUntil =
      endDateObj > lastGeneratedUntilObj ? endDate : lastGeneratedUntil;

    await db
      .update(scheduleGenerationLog)
      .set({
        generatedUntil: newGeneratedUntil,
        generatedFrom: newGeneratedFrom,
      })
      .where(eq(scheduleGenerationLog.id, log.id));
  }
}
