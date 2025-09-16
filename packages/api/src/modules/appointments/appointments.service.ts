import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { Temporal } from 'temporal-polyfill';

export interface ServiceEmployeeRequest {
  serviceId: string;
  employeeId: string;
}

export interface DateAvailability {
  day: Date;
  hours: string[];
}

export interface IndividualAvailability {
  employeeId: string;
  serviceId: string;
  datesAvailable: DateAvailability[];
}

export interface SetAvailability {
  day: Date;
  startHour: string;
  endHour: string;
}

export interface AvailabilityResponseV2 {
  set?: SetAvailability;
  individuals: IndividualAvailability[];
}

export class AppointmentsService {
  /**
   * Convierte duración en formato string a minutos
   */
  private parseDurationToMinutes(duration: string): number {
    if (/^\d+$/.test(duration)) {
      return parseInt(duration);
    }
    
    let totalMinutes = 0;
    const hourMatch = duration.match(/(\d+)h/);
    const minuteMatch = duration.match(/(\d+)m/);
    
    if (hourMatch && hourMatch[1]) {
      totalMinutes += parseInt(hourMatch[1]) * 60;
    }
    if (minuteMatch && minuteMatch[1]) {
      totalMinutes += parseInt(minuteMatch[1]);
    }
    
    return totalMinutes || 0;
  }

  /**
   * Convierte tiempo en formato "HH:MM" a minutos desde medianoche
   */
  private timeToMinutes(time: string): number {
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    
    const hours = parseInt(parts[0] || '0');
    const minutes = parseInt(parts[1] || '0');
    
    if (isNaN(hours) || isNaN(minutes)) return 0;
    
    return hours * 60 + minutes;
  }

  /**
   * Convierte minutos desde medianoche a formato "HH:MM"
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Genera fechas para los próximos días usando Temporal
   */
  private generarFechasProximosDias(dias: number): Temporal.PlainDate[] {
    const fechas: Temporal.PlainDate[] = [];
    const hoy = Temporal.Now.plainDateISO();
    
    for (let i = 0; i < dias; i++) {
      const fecha = hoy.add({ days: i });
      fechas.push(fecha);
    }
    
    return fechas;
  }

  /**
   * Obtiene horario base de un empleado para un día de la semana
   */
  private obtenerHorarioEmpleado(empleado: any, dayOfWeek: number) {
    return empleado.schedules?.find((s: any) => s.dayOfWeek === dayOfWeek) || null;
  }

  /**
   * Obtiene excepciones de un empleado para una fecha específica
   */
  private obtenerExcepcionesEmpleado(empleado: any, fecha: Temporal.PlainDate) {
    const fechaString = fecha.toString();
    return empleado.exceptions?.find((e: any) => {
      if (!e.date) return false;
      const exceptionDate = Temporal.PlainDate.from(e.date.toISOString().split('T')[0]);
      return exceptionDate.equals(fecha);
    }) || null;
  }

  /**
   * Obtiene citas ocupadas de un empleado para una fecha (placeholder)
   */
  private async obtenerCitasEmpleado(empleadoId: string, fecha: Temporal.PlainDate): Promise<Array<{ start: string; end: string }>> {
    // TODO: Implementar consulta real a la base de datos de citas
    // Por ahora retornamos array vacío
    return [];
  }

  /**
   * Construye slots disponibles considerando horario base, excepciones y citas ocupadas
   */
  private construirSlots(
    horarioBase: any,
    excepciones: any,
    citasOcupadas: Array<{ start: string; end: string }>
  ): Array<{ start: string; end: string }> {
    if (!horarioBase) return [];

    let startTime = horarioBase.startTime;
    let endTime = horarioBase.endTime;

    // Aplicar excepciones
    if (excepciones) {
      if (!excepciones.isAvailable) return [];
      if (excepciones.startTime && excepciones.endTime) {
        startTime = excepciones.startTime;
        endTime = excepciones.endTime;
      }
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const slots: Array<{ start: string; end: string }> = [];

    // Generar slots de 5 minutos
    for (let current = startMinutes; current < endMinutes; current += 5) {
      const slotStart = this.minutesToTime(current);
      const slotEnd = this.minutesToTime(current + 5);
      
      // Verificar que no choque con citas ocupadas
      const isOccupied = citasOcupadas.some(cita => {
        const citaStart = this.timeToMinutes(cita.start);
        const citaEnd = this.timeToMinutes(cita.end);
        return current < citaEnd && (current + 5) > citaStart;
      });

      if (!isOccupied) {
        slots.push({ start: slotStart, end: slotEnd });
      }
    }

    return slots;
  }

  /**
   * Filtra slots por duración mínima requerida
   */
  private filtrarSlotsPorDuracion(
    slots: Array<{ start: string; end: string }>,
    duracionMinutos: number
  ): string[] {
    const slotsValidos: string[] = [];
    
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot) continue;
      
      const startMinutes = this.timeToMinutes(slot.start);
      let duracionDisponible = 0;
      
      // Verificar cuántos slots consecutivos hay disponibles
      for (let j = i; j < slots.length; j++) {
        const currentSlot = slots[j];
        if (!currentSlot) break;
        
        const currentStart = this.timeToMinutes(currentSlot.start);
        const expectedStart = startMinutes + (j - i) * 5;
        
        if (currentStart === expectedStart) {
          duracionDisponible += 5;
          if (duracionDisponible >= duracionMinutos) {
            slotsValidos.push(slot.start);
            break;
          }
        } else {
          break;
        }
      }
    }
    
    return slotsValidos;
  }

  /**
   * Nuevo método para calcular disponibilidad con formato V2
   */
  async calcularDisponibilidad(
    serviciosEmpleados: ServiceEmployeeRequest[],
    organizationId: string
  ): Promise<{
    status: number;
    message: string;
    data: AvailabilityResponseV2 | null;
  }> {
    try {
      if (!serviciosEmpleados || serviciosEmpleados.length === 0) {
        throw new Error("Debe seleccionar al menos un servicio");
      }

      if (!organizationId) {
        throw new Error("Se requiere el ID de la organización");
      }

      // Obtener información de servicios y empleados
      const servicios = await prismaClient.service.findMany({
        where: {
          id: { in: serviciosEmpleados.map(se => se.serviceId) },
          organizationId
        }
      });

      const empleados = await prismaClient.employee.findMany({
        where: {
          id: { in: serviciosEmpleados.map(se => se.employeeId) },
          organizationId
        },
        include: {
          schedules: true,
          exceptions: true,
          categories: true
        }
      });

      // Validar que todos los servicios y empleados existen
      for (const se of serviciosEmpleados) {
        const servicio = servicios.find(s => s.id === se.serviceId);
        const empleado = empleados.find(e => e.id === se.employeeId);
        
        if (!servicio) {
          throw new Error(`Servicio ${se.serviceId} no encontrado`);
        }
        if (!empleado) {
          throw new Error(`Empleado ${se.employeeId} no encontrado`);
        }
        
        // Verificar que el empleado puede realizar el servicio
        const puedeRealizarServicio = empleado.categories?.some(cat => cat.id === servicio.categoryId);
        if (!puedeRealizarServicio) {
          throw new Error(`El empleado ${empleado.name} no puede realizar el servicio ${servicio.name}`);
        }
      }

      const fechas = this.generarFechasProximosDias(21);
      const individuals: IndividualAvailability[] = [];

      // Calcular disponibilidad individual para cada servicio-empleado
      for (const se of serviciosEmpleados) {
        const servicio = servicios.find(s => s.id === se.serviceId)!;
        const empleado = empleados.find(e => e.id === se.employeeId)!;
        
        const datesAvailable: DateAvailability[] = [];

        for (const fecha of fechas) {
          const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
          
          if (!horarioBase) continue;

          const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
          const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);

          const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas);
          const duracionServicio = this.parseDurationToMinutes(servicio.duration);
          const slotsValidos = this.filtrarSlotsPorDuracion(slotsDisponibles, duracionServicio);

          if (slotsValidos.length > 0) {
            datesAvailable.push({
              day: new Date(fecha.toString()),
              hours: slotsValidos
            });
          }
        }

        individuals.push({
          employeeId: se.employeeId,
          serviceId: se.serviceId,
          datesAvailable
        });
      }

      // Determinar si hay un conjunto combinado disponible
      let setAvailability: SetAvailability | undefined;

      // Caso 1: Un solo servicio - no hay conjunto
      if (serviciosEmpleados.length === 1) {
        return {
          status: 200,
          message: "Disponibilidad calculada para servicio individual",
          data: { individuals }
        };
      }

      // Caso 2: Múltiples servicios con el mismo empleado
      const empleadosUnicos = [...new Set(serviciosEmpleados.map(se => se.employeeId))];
      
      if (empleadosUnicos.length === 1) {
        // Todos los servicios son con el mismo empleado
        const empleadoId = empleadosUnicos[0];
        const empleado = empleados.find(e => e.id === empleadoId)!;
        
        // Calcular duración total
        const duracionTotal = serviciosEmpleados.reduce((total, se) => {
          const servicio = servicios.find(s => s.id === se.serviceId)!;
          return total + this.parseDurationToMinutes(servicio.duration);
        }, 0);

        // Buscar fechas donde se pueden hacer todos los servicios consecutivos
        for (const fecha of fechas) {
          const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
          
          if (!horarioBase) continue;

          const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
          const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);

          const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas);
          const slotsContinuos = this.filtrarSlotsPorDuracion(slotsDisponibles, duracionTotal);

          if (slotsContinuos.length > 0) {
            const primerSlot = slotsContinuos[0];
            if (primerSlot) {
              const ultimoSlot = this.minutesToTime(
                this.timeToMinutes(primerSlot) + duracionTotal
              );

              setAvailability = {
                day: new Date(fecha.toString()),
                startHour: primerSlot,
                endHour: ultimoSlot
              };
              break;
            }
          }
        }
      } else {
        // Caso 3: Múltiples servicios con diferentes empleados
        // Buscar fechas donde todos los empleados están disponibles en secuencia
        for (const fecha of fechas) {
          let puedenTodos = true;
          let horaInicio: string | null = null;
          let horaFin: string | null = null;

          // Verificar disponibilidad secuencial
          let horaActual = 8 * 60; // Empezar a las 8:00 AM

          for (const se of serviciosEmpleados) {
            const servicio = servicios.find(s => s.id === se.serviceId)!;
            const empleado = empleados.find(e => e.id === se.employeeId)!;
            
            const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
            if (!horarioBase) {
              puedenTodos = false;
              break;
            }

            const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
            const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);
            const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas);
            
            const duracionServicio = this.parseDurationToMinutes(servicio.duration);
            const horaInicioString = this.minutesToTime(horaActual);
            
            // Verificar si el empleado está disponible en esta hora
            const slotDisponible = slotsDisponibles.find(slot => 
              this.timeToMinutes(slot.start) <= horaActual &&
              this.timeToMinutes(slot.end) >= horaActual + duracionServicio
            );

            if (!slotDisponible) {
              puedenTodos = false;
              break;
            }

            if (!horaInicio) horaInicio = horaInicioString;
            horaActual += duracionServicio;
          }

          if (puedenTodos && horaInicio) {
            horaFin = this.minutesToTime(horaActual);
            setAvailability = {
              day: new Date(fecha.toString()),
              startHour: horaInicio,
              endHour: horaFin
            };
            break;
          }
        }
      }

      const response: AvailabilityResponseV2 = {
        individuals
      };

      if (setAvailability) {
        response.set = setAvailability;
      }

      return {
        status: 200,
        message: `Disponibilidad calculada: ${individuals.length} servicios individuales${setAvailability ? ', con opción de conjunto disponible' : ''}`,
        data: response
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      return {
        status: 500,
        message: errorMessage,
        data: null,
      };
    }
  }
}