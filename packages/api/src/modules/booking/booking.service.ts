import { CustomerService } from "@meetzeen/api/src/modules/customers/customer.service";
import {
  db,
  member,
  user,
  service,
  organization,
  appointment,
  servicesBooked,
  dailyAvailability,
} from "@meetzeen/database";
import { and, eq, inArray, or } from "drizzle-orm";

export class BookingService {
  constructor(private readonly customerService: CustomerService) {}

  async createBooking(
    organizationId: string,
    memberId: string,
    services: string[],
    date: string, // YYYY-MM-DD
    startTime: string, // HH:MM
    customerData: {
      name: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
    }
  ) {
    // 1. Validar que el miembro pertenece a la organización
    const memberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.id, memberId),
        eq(member.organizationId, organizationId)
      ),
      with: {
        user: true,
      },
    });

    if (!memberRecord) {
      throw new Error("El empleado no pertenece a esta organización");
    }

    // 2. Validar que los servicios pertenecen a la organización
    const serviceRecords = await db
      .select()
      .from(service)
      .where(
        and(
          inArray(service.id, services),
          eq(service.organizationId, organizationId)
        )
      );

    if (serviceRecords.length !== services.length) {
      throw new Error(
        "Uno o más servicios no pertenecen a esta organización"
      );
    }

    // 3. Calcular duración total y endTime
    const totalDuration = serviceRecords.reduce(
      (sum, s) => sum + s.duration,
      0
    );
    const endTime = this.calculateEndTime(startTime, totalDuration);

    // 4. Validar disponibilidad del horario
    await this.validateAvailability(
      memberId,
      date,
      startTime,
      endTime,
      totalDuration
    );

    // 5. Crear o actualizar el cliente
    const customer = await this.customerService.upsertCustomer({
      organizationId,
      name: customerData.name,
      lastName: customerData.lastName,
      email: customerData.email,
      phoneNumber: customerData.phoneNumber,
    });

    // 6. Calcular totales
    const { totalAmount, totalDiscount } = this.calculateTotals(serviceRecords);

    // 7. Obtener información de la organización para campos denormalizados
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
    });

    if (!org) {
      throw new Error("Organización no encontrada");
    }

    // 8. Crear el appointment con campos denormalizados
    const [newAppointment] = await db
      .insert(appointment)
      .values({
        organizationId,
        customerId: customer.id,
        memberId: memberRecord.id,
        serviceId: serviceRecords[0]?.id || null, // Primer servicio como referencia
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phoneNumber || null,
        memberName: memberRecord.user.name,
        memberEmail: memberRecord.user.email,
        memberRole: memberRecord.role,
        appointmentDate: date,
        startTime: startTime,
        endTime: endTime,
        status: "scheduled",
        paymentStatus: "pending",
        amountPaid: totalAmount.toString(),
        source: "online",
      })
      .returning();

    // 9. Crear los servicios reservados (ServicesBooked)
    const servicesBookedData = serviceRecords.map((serviceRecord, index) => {
      const servicePrice = parseFloat(serviceRecord.price);
      const discount = serviceRecord.discount || 0;
      const serviceTotal = discount > 0
        ? servicePrice * (1 - discount / 100)
        : servicePrice;
      const serviceDiscountTotal = discount > 0
        ? servicePrice - serviceTotal
        : 0;

      return {
        appointmentId: newAppointment.id,
        serviceId: serviceRecord.id,
        serviceName: serviceRecord.name,
        servicePrice: serviceRecord.price,
        serviceDuration: serviceRecord.duration,
        serviceDiscount: serviceRecord.discount || null,
        serviceTotal: serviceTotal.toString(),
        serviceDiscountTotal: serviceDiscountTotal.toString(),
        order: index,
      };
    });

    await db.insert(servicesBooked).values(servicesBookedData);

    // 10. Retornar el appointment creado con sus servicios
    const appointmentWithServices = await db.query.appointment.findFirst({
      where: eq(appointment.id, newAppointment.id),
      with: {
        servicesBooked: true,
        customer: true,
        member: {
          with: {
            user: true,
          },
        },
      },
    });

    return appointmentWithServices;
  }

  /**
   * Calcula el tiempo de finalización basado en el tiempo de inicio y la duración
   * Retorna en formato "HH:MM:SS" para el tipo time() de PostgreSQL
   */
  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + durationMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    // Formato "HH:MM:SS" para el tipo time() de PostgreSQL
    return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(
      2,
      "0"
    )}:00`;
  }

  /**
   * Valida la disponibilidad del horario para el miembro
   */
  private async validateAvailability(
    memberId: string,
    date: string,
    startTime: string,
    endTime: string,
    durationMinutes: number
  ): Promise<void> {
    // 1. Verificar disponibilidad diaria
    const dailyAvail = await db.query.dailyAvailability.findFirst({
      where: and(
        eq(dailyAvailability.memberId, memberId),
        eq(dailyAvailability.date, date)
      ),
    });

    if (!dailyAvail || !dailyAvail.isWorkingDay) {
      throw new Error("El empleado no está disponible en esta fecha");
    }

    // 2. Verificar que el horario está dentro de los bloques de tiempo disponibles
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    const isTimeSlotAvailable = dailyAvail.timeBlocks.some((block) => {
      const blockStart = this.timeToMinutes(block.startTime);
      const blockEnd = this.timeToMinutes(block.endTime);
      return startMinutes >= blockStart && endMinutes <= blockEnd;
    });

    if (!isTimeSlotAvailable) {
      throw new Error(
        "El horario seleccionado no está disponible para este empleado"
      );
    }

    // 3. Verificar que no hay citas existentes que colisionen
    const existingAppointments = await db
      .select()
      .from(appointment)
      .where(
        and(
          eq(appointment.memberId, memberId),
          eq(appointment.appointmentDate, date),
          or(
            eq(appointment.status, "scheduled"),
            eq(appointment.status, "confirmed"),
            eq(appointment.status, "in_progress")
          )
        )
      );

    const hasConflict = existingAppointments.some((apt) => {
      const aptStart = this.timeToMinutes(apt.startTime);
      // endTime puede venir como string en formato "HH:MM:SS" o "HH:MM"
      const aptEndTimeStr =
        typeof apt.endTime === "string"
          ? apt.endTime.substring(0, 5) // Tomar solo HH:MM
          : apt.endTime;
      const aptEnd = this.timeToMinutes(aptEndTimeStr);
      // Hay conflicto si los rangos se superponen
      return startMinutes < aptEnd && endMinutes > aptStart;
    });

    if (hasConflict) {
      throw new Error(
        "El horario seleccionado tiene conflicto con otra cita existente"
      );
    }
  }

  /**
   * Convierte tiempo en formato "HH:MM" a minutos desde medianoche
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Calcula los totales de los servicios incluyendo descuentos
   */
  private calculateTotals(serviceRecords: typeof service.$inferSelect[]) {
    let totalAmount = 0;
    let totalDiscount = 0;

    for (const serviceRecord of serviceRecords) {
      const servicePrice = parseFloat(serviceRecord.price);
      const discount = serviceRecord.discount || 0;
      const serviceTotal = discount > 0
        ? servicePrice * (1 - discount / 100)
        : servicePrice;
      const serviceDiscountAmount = discount > 0
        ? servicePrice - serviceTotal
        : 0;

      totalAmount += serviceTotal;
      totalDiscount += serviceDiscountAmount;
    }

    return {
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    };
  }
}
