import {
  db,
  service,
  member,
  user,
  dailyAvailability,
  weeklyScheduleTemplate,
  scheduleGenerationLog,
  organization,
} from "@meetzeen/database";
import { eq, inArray, and, gte, lte } from "drizzle-orm";
import type { TimeBlock } from "@meetzeen/api/src/modules/team/types/team.types";

export class SlugService {
  constructor() {}

  async getCompanyBySlug(slug: string) {
    const [company] = await db
      .select()
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1);

    if (!company) {
      throw new Error("Company not found");
    }

    const services = await db
      .select({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        discount: service.discount,
      })
      .from(service)
      .where(eq(service.organizationId, company.id));

    return {
      company,
      services,
    };
  }

  async getAvailability(
    companyId: string,
    serviceIds: string[],
    startDate?: string,
    endDate?: string
  ) {
    // 1. Validar que se envíe al menos un servicio
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error("Debe enviar al menos un servicio");
    }

    // 2. Buscar todos los servicios por ID y organización
    const services = await db
      .select()
      .from(service)
      .where(
        and(
          inArray(service.id, serviceIds),
          eq(service.organizationId, companyId)
        )
      );

    if (services.length === 0) {
      throw new Error(
        "No se encontraron servicios válidos para esta organización"
      );
    }

    // Obtener la duración máxima del servicio (para calcular slots disponibles)
    // Usamos la máxima para asegurar que cada slot pueda acomodar cualquier servicio
    // El intervalo de 15 minutos en calculateAvailableSlots generará suficientes opciones
    const maxDuration = Math.max(...services.map((s) => s.duration));

    // 3. Obtener la organización para timezone
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, companyId),
      columns: { timezone: true },
    });
    const timezone = org?.timezone || "UTC";

    // 4. Buscar todos los miembros de la organización
    const members = await db
      .select({
        memberId: member.id,
        userId: member.userId,
        role: member.role,
      })
      .from(member)
      .where(eq(member.organizationId, companyId));

    if (members.length === 0) {
      return [];
    }

    // 5. Obtener información de usuarios
    const userIds = members.map((m) => m.userId);
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(inArray(user.id, userIds));

    const userMap = new Map(users.map((u) => [u.id, u]));

    // 6. Calcular rango de fechas (por defecto: hoy + 30 días)
    const today = this.getTodayInTimezone(timezone);
    const fromDate = startDate || today;
    const toDate = endDate || this.addDays(today, 30);

    // 7. Asegurar que las disponibilidades estén generadas para todos los miembros
    const memberIds = members.map((m) => m.memberId);
    await Promise.all(
      memberIds.map((memberId) =>
        this.ensureAvailabilitiesGenerated(memberId, fromDate, toDate, timezone)
      )
    );

    // 8. Obtener disponibilidades diarias de todos los miembros
    const availabilities = await db
      .select({
        id: dailyAvailability.id,
        memberId: dailyAvailability.memberId,
        date: dailyAvailability.date,
        timeBlocks: dailyAvailability.timeBlocks,
        isWorkingDay: dailyAvailability.isWorkingDay,
      })
      .from(dailyAvailability)
      .where(
        and(
          inArray(dailyAvailability.memberId, memberIds),
          gte(dailyAvailability.date, fromDate),
          lte(dailyAvailability.date, toDate)
        )
      );

    // 9. Agrupar disponibilidades por miembro
    const availabilityByMember = new Map<string, typeof availabilities>();
    for (const avail of availabilities) {
      const existing = availabilityByMember.get(avail.memberId) || [];
      existing.push(avail);
      availabilityByMember.set(avail.memberId, existing);
    }

    // 10. Construir respuesta para cada empleado
    const result = [];

    for (const memberRecord of members) {
      const userData = userMap.get(memberRecord.userId);
      if (!userData) continue;

      const memberAvailabilities =
        availabilityByMember.get(memberRecord.memberId) || [];

      // Ordenar por fecha
      memberAvailabilities.sort((a, b) => a.date.localeCompare(b.date));

      // Calcular slots disponibles para cada día
      const availabilitySlots: Record<string, string[]>[] = [];

      for (const dayAvail of memberAvailabilities) {
        if (
          !dayAvail.isWorkingDay ||
          !dayAvail.timeBlocks ||
          dayAvail.timeBlocks.length === 0
        ) {
          continue;
        }

        const slots = this.calculateAvailableSlots(
          dayAvail.timeBlocks,
          maxDuration,
          [] // Por ahora sin citas existentes - se puede agregar después
        );

        if (slots.length > 0) {
          availabilitySlots.push({
            [`Date:${dayAvail.date}`]: slots,
          });
        }
      }

      result.push({
        info: {
          memberId: memberRecord.memberId,
          name: userData.name,
          imageUrl: userData.image,
        },
        availability: availabilitySlots,
      });
    }

    return result;
  }

  /**
   * Calcula los slots de tiempo disponibles basándose en los bloques de tiempo
   * y la duración del servicio.
   *
   * @param timeBlocks - Bloques de tiempo disponibles del empleado
   * @param serviceDuration - Duración del servicio en minutos
   * @param existingAppointments - Citas existentes (para futuro uso)
   * @param bufferMinutes - Minutos de buffer entre citas (default: 5)
   */
  private calculateAvailableSlots(
    timeBlocks: TimeBlock[],
    serviceDuration: number,
    existingAppointments: Array<{ startTime: string; endTime: string }> = [],
    bufferMinutes: number = 5
  ): string[] {
    const slots: string[] = [];
    
    // Intervalo mínimo para generar slots (15 minutos para permitir flexibilidad)
    // Esto permite que servicios de diferentes duraciones puedan encontrar horarios
    const slotInterval = 15;

    for (const block of timeBlocks) {
      const blockStart = this.timeToMinutes(block.startTime);
      const blockEnd = this.timeToMinutes(block.endTime);

      // Generar slots cada intervalo dentro del bloque
      let currentSlot = blockStart;

      while (currentSlot + serviceDuration <= blockEnd) {
        const slotTimeStr = this.minutesToTime(currentSlot);
        const slotEnd = currentSlot + serviceDuration;

        // Verificar si el slot no colisiona con citas existentes
        const isSlotAvailable = !existingAppointments.some((apt) => {
          const aptStart = this.timeToMinutes(apt.startTime);
          const aptEnd = this.timeToMinutes(apt.endTime) + bufferMinutes;

          // Hay colisión si los rangos se superponen
          return currentSlot < aptEnd && slotEnd > aptStart;
        });

        if (isSlotAvailable) {
          slots.push(slotTimeStr);
        }

        // Buscar la próxima cita que podría afectar este slot
        const nextAppointment = existingAppointments.find((apt) => {
          const aptStart = this.timeToMinutes(apt.startTime);
          return aptStart > currentSlot && aptStart < currentSlot + serviceDuration + slotInterval;
        });

        if (nextAppointment) {
          // Si hay una cita próxima, saltar al final de la cita + buffer
          const aptEnd =
            this.timeToMinutes(nextAppointment.endTime) + bufferMinutes;
          // Asegurar que avanzamos al menos un intervalo
          currentSlot = Math.max(aptEnd, currentSlot + slotInterval);
        } else {
          // Avanzar según el intervalo (15 minutos por defecto)
          // Esto permite generar más opciones para servicios de diferentes duraciones
          currentSlot += slotInterval;
        }
      }
    }

    return slots;
  }

  /**
   * Convierte tiempo en formato "HH:MM" a minutos desde medianoche
   */
  private timeToMinutes(time: string): number {
    const parts = time.split(":").map(Number);
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) {
      throw new Error(`Formato de hora inválido: ${time}`);
    }
    const [hours, minutes] = parts;
    return hours * 60 + minutes;
  }

  /**
   * Convierte minutos desde medianoche a formato "HH:MM"
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  /**
   * Obtiene la fecha de hoy en la zona horaria especificada
   */
  private getTodayInTimezone(timezone: string): string {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  }

  /**
   * Suma días a una fecha
   */
  private addDays(date: string, days: number): string {
    const dateParts = date.split("-").map(Number);
    if (
      dateParts.length < 3 ||
      dateParts[0] === undefined ||
      dateParts[1] === undefined ||
      dateParts[2] === undefined
    ) {
      throw new Error("Formato de fecha inválido");
    }
    const [year, month, day] = dateParts;
    const d = new Date(year, month - 1, day, 12, 0, 0);
    d.setDate(d.getDate() + days);

    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, "0");
    const newDay = String(d.getDate()).padStart(2, "0");
    return `${newYear}-${newMonth}-${newDay}`;
  }

  /**
   * Asegura que las disponibilidades estén generadas para el miembro en el rango de fechas
   */
  private async ensureAvailabilitiesGenerated(
    memberId: string,
    startDate: string,
    endDate: string,
    timezone: string = "UTC"
  ) {
    const log = await db.query.scheduleGenerationLog.findFirst({
      where: eq(scheduleGenerationLog.memberId, memberId),
    });

    const parseDate = (dateStr: string): Date => {
      const dateParts = dateStr.split("-").map(Number);
      if (
        dateParts.length < 3 ||
        dateParts[0] === undefined ||
        dateParts[1] === undefined ||
        dateParts[2] === undefined
      ) {
        throw new Error("Formato de fecha inválido");
      }
      const [year, month, day] = dateParts;
      return new Date(year, month - 1, day, 12, 0, 0);
    };

    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    if (!log) {
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

    if (startDateObj < lastGeneratedFromObj) {
      await this.generateAvailabilities(
        memberId,
        startDate,
        this.addDays(lastGeneratedFrom, -1),
        timezone
      );
    }

    if (endDateObj > lastGeneratedUntilObj) {
      await this.generateAvailabilities(
        memberId,
        this.addDays(lastGeneratedUntil, 1),
        endDate,
        timezone
      );
    }

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

  /**
   * Genera disponibilidades basándose en los templates semanales
   */
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
      const dateParts = date.split("-").map(Number);
      if (
        dateParts.length < 3 ||
        dateParts[0] === undefined ||
        dateParts[1] === undefined ||
        dateParts[2] === undefined
      ) {
        continue;
      }
      const [year, month, day] = dateParts;
      const dateInUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
      });
      const weekdayName = formatter.format(dateInUTC);

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

    if (availabilities.length > 0) {
      await db
        .insert(dailyAvailability)
        .values(availabilities)
        .onConflictDoNothing();
    }
  }

  /**
   * Genera un rango de fechas entre start y end
   */
  private generateDateRange(start: string, end: string): string[] {
    const dates: string[] = [];

    const startParts = start.split("-").map(Number);
    const endParts = end.split("-").map(Number);
    if (
      startParts.length < 3 ||
      startParts[0] === undefined ||
      startParts[1] === undefined ||
      startParts[2] === undefined
    ) {
      throw new Error("Formato de fecha de inicio inválido");
    }
    if (
      endParts.length < 3 ||
      endParts[0] === undefined ||
      endParts[1] === undefined ||
      endParts[2] === undefined
    ) {
      throw new Error("Formato de fecha de fin inválido");
    }
    const [startYear, startMonth, startDay] = startParts;
    const [endYear, endMonth, endDay] = endParts;

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
}
