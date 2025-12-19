import {
  db,
  service,
  member,
  user,
  dailyAvailability,
  weeklyScheduleTemplate,
  scheduleGenerationLog,
  organization,
  appointment,
} from "@meetzeen/database";
import { eq, inArray, and, gte, lte } from "drizzle-orm";
import type { TimeBlock } from "@meetzeen/api/src/modules/team/types/team.types";

interface ExistingAppointment {
  startTime: string;
  endTime: string;
  date: string;
}

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
    clientTimezone: string,
    clientCurrentTime: string,
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

    const maxDuration = Math.max(...services.map((s) => s.duration));

    // 3. Obtener la organización para timezone
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, companyId),
      columns: { timezone: true },
    });
    const serverTimezone = org?.timezone || "UTC";

    // 4. Calcular fecha y hora actual en el timezone del cliente
    const clientNow = this.parseClientDateTime(clientCurrentTime, clientTimezone);

    // 5. Buscar todos los miembros de la organización
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

    // 6. Obtener información de usuarios (una sola query)
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

    // 7. Calcular rango de fechas
    const today = this.getTodayInTimezone(clientTimezone);
    const fromDate = startDate || today;
    const toDate = endDate || this.addDays(today, 30);

    // 8. Asegurar disponibilidades generadas (en paralelo)
    const memberIds = members.map((m) => m.memberId);
    await Promise.all(
      memberIds.map((memberId) =>
        this.ensureAvailabilitiesGenerated(memberId, fromDate, toDate, serverTimezone)
      )
    );

    // 9. OPTIMIZACIÓN: Obtener disponibilidades y citas en paralelo
    const [availabilities, appointments] = await Promise.all([
      db
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
        ),
      
      // Obtener citas existentes confirmadas y programadas
      db
        .select({
          memberId: appointment.memberId,
          appointmentDate: appointment.appointmentDate,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        })
        .from(appointment)
        .where(
          and(
            inArray(appointment.memberId, memberIds),
            gte(appointment.appointmentDate, fromDate),
            lte(appointment.appointmentDate, toDate),
            inArray(appointment.status, ["scheduled", "confirmed", "in_progress"])
          )
        )
    ]);

    // 10. Agrupar citas por miembro y fecha para acceso O(1)
    const appointmentsByMemberDate = new Map<string, ExistingAppointment[]>();
    for (const apt of appointments) {
      if (!apt.memberId) continue;
      
      const key = `${apt.memberId}-${apt.appointmentDate}`;
      const existing = appointmentsByMemberDate.get(key) || [];
      existing.push({
        startTime: apt.startTime,
        endTime: String(apt.endTime),
        date: apt.appointmentDate,
      });
      appointmentsByMemberDate.set(key, existing);
    }

    // 11. Agrupar disponibilidades por miembro
    const availabilityByMember = new Map<string, typeof availabilities>();
    for (const avail of availabilities) {
      const existing = availabilityByMember.get(avail.memberId) || [];
      existing.push(avail);
      availabilityByMember.set(avail.memberId, existing);
    }

    // 12. Construir respuesta para cada empleado
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

        // Obtener citas del empleado para este día
        const key = `${memberRecord.memberId}-${dayAvail.date}`;
        const dayAppointments = appointmentsByMemberDate.get(key) || [];

        // Determinar tiempo mínimo basado en hora actual del cliente
        let minTimeInMinutes: number | null = null;
        if (dayAvail.date === clientNow.date) {
          // Si es el día de hoy, usar la hora actual del cliente
          minTimeInMinutes = this.timeToMinutes(clientNow.time);
        }

        const slots = this.calculateAvailableSlots(
          dayAvail.timeBlocks,
          maxDuration,
          dayAppointments,
          5, // buffer minutes
          minTimeInMinutes
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
   * Calcula los slots de tiempo disponibles considerando citas existentes
   * y la hora actual del cliente
   */
  private calculateAvailableSlots(
    timeBlocks: TimeBlock[],
    serviceDuration: number,
    existingAppointments: ExistingAppointment[] = [],
    bufferMinutes: number = 5,
    minTimeInMinutes: number | null = null
  ): string[] {
    const slots: string[] = [];
    const slotInterval = 15;

    for (const block of timeBlocks) {
      let blockStart = this.timeToMinutes(block.startTime);
      const blockEnd = this.timeToMinutes(block.endTime);

      // Si hay un tiempo mínimo, ajustar el inicio del bloque
      if (minTimeInMinutes !== null && blockStart < minTimeInMinutes) {
        // Redondear hacia arriba al siguiente intervalo
        blockStart = Math.ceil(minTimeInMinutes / slotInterval) * slotInterval;
        
        // Si el tiempo mínimo supera el final del bloque, saltar este bloque
        if (blockStart >= blockEnd) {
          continue;
        }
      }

      let currentSlot = blockStart;

      while (currentSlot + serviceDuration <= blockEnd) {
        const slotTimeStr = this.minutesToTime(currentSlot);
        const slotEnd = currentSlot + serviceDuration;

        // Verificar si el slot no colisiona con citas existentes
        const isSlotAvailable = !existingAppointments.some((apt) => {
          const aptStart = this.timeToMinutes(apt.startTime);
          const aptEndTime = typeof apt.endTime === 'string' ? apt.endTime : '00:00';
          const aptEnd = this.timeToMinutes(aptEndTime) + bufferMinutes;

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
          const aptEndTime = typeof nextAppointment.endTime === 'string' ? nextAppointment.endTime : '00:00';
          const aptEnd = this.timeToMinutes(aptEndTime) + bufferMinutes;
          currentSlot = Math.max(aptEnd, currentSlot + slotInterval);
        } else {
          currentSlot += slotInterval;
        }
      }
    }

    return slots;
  }

  /**
   * Parsea la hora actual del cliente en formato ISO o "YYYY-MM-DD HH:MM"
   */
  private parseClientDateTime(
    clientCurrentTime: string,
    timezone: string
  ): { date: string; time: string } {
    // Intentar parsear como ISO string o formato personalizado
    let date: Date;
    
    if (clientCurrentTime.includes('T') || clientCurrentTime.includes('Z')) {
      // Formato ISO
      date = new Date(clientCurrentTime);
    } else {
      // Formato "YYYY-MM-DD HH:MM"
      const [datePart, timePart] = clientCurrentTime.split(' ');
      if (!datePart || !timePart) {
        throw new Error('Formato de hora del cliente inválido');
      }
      date = new Date(`${datePart}T${timePart}:00`);
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const dateStr = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`;
    const timeStr = `${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}`;

    return { date: dateStr, time: timeStr };
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