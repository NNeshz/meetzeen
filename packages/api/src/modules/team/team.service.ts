import { baseSchedule, db, member, user } from "@meetzeen/database";
import { and, asc, eq, inArray } from "drizzle-orm";

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

  async getMemberCalendar(userId: string, organizationId: string) {
    if (!userId || !organizationId) {
      throw new Error("User ID and Organization ID are required");
    }

    const memberRecord = await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.organizationId, organizationId)),
    });

    if (!memberRecord) {
      throw new Error("Member not found in this organization");
    }

    const calendar = await db
      .select()
      .from(baseSchedule)
      .where(eq(baseSchedule.memberId, memberRecord.id))
      .orderBy(asc(baseSchedule.dayOfWeek));

    return calendar;
  }

  async updateMemberCalendar(
    userId: string,
    organizationId: string,
    schedules: Array<{
      dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
      startTime: string; // Format: "HH:mm"
      endTime: string; // Format: "HH:mm"
    }>
  ) {
    if (!userId || !organizationId) {
      throw new Error("User ID and Organization ID are required");
    }

    if (!schedules || !Array.isArray(schedules)) {
      throw new Error("Schedules must be an array");
    }

    // Buscar el member
    const memberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.userId, userId),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!memberRecord) {
      throw new Error("Member not found in this organization");
    }

    // Función para normalizar formato de tiempo (asegurar formato HH:mm)
    const normalizeTime = (time: string): string => {
      // Si viene en formato ISO o con segundos, extraer solo HH:mm
      const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);

        // Validar rango de horas y minutos
        if (hours < 0 || hours > 23) {
          throw new Error(`Hora inválida: ${hours}. Debe estar entre 0 y 23`);
        }
        if (minutes < 0 || minutes > 59) {
          throw new Error(`Minutos inválidos: ${minutes}. Debe estar entre 0 y 59`);
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
      throw new Error(`Formato de tiempo inválido: ${time}. Debe ser "HH:mm"`);
    };

    // Validar y procesar los horarios
    const validSchedules: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }> = [];

    for (const schedule of schedules) {
      // Validar dayOfWeek (0-6)
      if (
        typeof schedule.dayOfWeek !== "number" ||
        schedule.dayOfWeek < 0 ||
        schedule.dayOfWeek > 6
      ) {
        throw new Error(
          `dayOfWeek inválido: ${schedule.dayOfWeek}. Debe ser un número entre 0 (Domingo) y 6 (Sábado)`
        );
      }

      // Validar que startTime y endTime existan
      if (!schedule.startTime || !schedule.endTime) {
        throw new Error(
          `startTime y endTime son requeridos para el día ${schedule.dayOfWeek}`
        );
      }

      // Normalizar tiempos
      const startTime = normalizeTime(schedule.startTime);
      const endTime = normalizeTime(schedule.endTime);

      // Validar que startTime < endTime
      if (startTime >= endTime) {
        throw new Error(
          `El tiempo de inicio (${startTime}) debe ser menor que el tiempo de fin (${endTime}) para el día ${schedule.dayOfWeek}`
        );
      }

      validSchedules.push({
        dayOfWeek: schedule.dayOfWeek,
        startTime,
        endTime,
      });
    }

    // Eliminar todos los baseSchedule existentes para este miembro
    await db
      .delete(baseSchedule)
      .where(eq(baseSchedule.memberId, memberRecord.id));

    // Crear los nuevos baseSchedule
    if (validSchedules.length > 0) {
      const now = new Date().toISOString();
      const schedulesToInsert = validSchedules.map((schedule) => ({
        memberId: memberRecord.id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        createdAt: now,
        updatedAt: now,
      }));

      await db.insert(baseSchedule).values(schedulesToInsert);
    }

    // Retornar los horarios creados
    const updatedSchedules = await db
      .select()
      .from(baseSchedule)
      .where(eq(baseSchedule.memberId, memberRecord.id))
      .orderBy(asc(baseSchedule.dayOfWeek));

    return {
      success: true,
      message: "Calendario actualizado exitosamente",
      schedules: updatedSchedules,
    };
  }
}
