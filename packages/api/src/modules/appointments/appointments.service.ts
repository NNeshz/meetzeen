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

export interface ServiceSlot {
  serviceId: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  order: number;
}

export interface SetAvailability {
  day: Date;
  startHour: string;
  endHour: string;
  services?: ServiceSlot[]; // Nueva propiedad para detallar la secuencia
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
   * Ahora genera slots basados en la duración del servicio
   */
  private construirSlots(
    horarioBase: any,
    excepciones: any,
    citasOcupadas: Array<{ start: string; end: string }>,
    duracionServicioMinutos: number
  ): string[] {
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
    const slotsDisponibles: string[] = [];

    // Generar slots basados en la duración del servicio
    for (let current = startMinutes; current + duracionServicioMinutos <= endMinutes; current += duracionServicioMinutos) {
      const slotStart = this.minutesToTime(current);
      const slotEnd = this.minutesToTime(current + duracionServicioMinutos);
      
      // Verificar que no choque con citas ocupadas
      const isOccupied = citasOcupadas.some(cita => {
        const citaStart = this.timeToMinutes(cita.start);
        const citaEnd = this.timeToMinutes(cita.end);
        // Verificar si hay solapamiento
        return current < citaEnd && (current + duracionServicioMinutos) > citaStart;
      });

      if (!isOccupied) {
        slotsDisponibles.push(slotStart);
      }
    }

    return slotsDisponibles;
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

      for (const se of serviciosEmpleados) {
        const servicio = servicios.find(s => s.id === se.serviceId);
        const empleado = empleados.find(e => e.id === se.employeeId);
        
        if (!servicio) {
          throw new Error(`Servicio ${se.serviceId} no encontrado`);
        }
        if (!empleado) {
          throw new Error(`Empleado ${se.employeeId} no encontrado`);
        }
        
        const puedeRealizarServicio = empleado.categories?.some(cat => cat.id === servicio.categoryId);
        if (!puedeRealizarServicio) {
          throw new Error(`El empleado ${empleado.name} no puede realizar el servicio ${servicio.name}`);
        }
      }

      const fechas = this.generarFechasProximosDias(21);
      const individuals: IndividualAvailability[] = [];

      for (const se of serviciosEmpleados) {
        const servicio = servicios.find(s => s.id === se.serviceId)!;
        const empleado = empleados.find(e => e.id === se.employeeId)!;
        
        const datesAvailable: DateAvailability[] = [];
        const duracionServicio = this.parseDurationToMinutes(servicio.duration);

        for (const fecha of fechas) {
          const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
          
          if (!horarioBase) continue;

          const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
          const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);

          const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas, duracionServicio);

          if (slotsDisponibles.length > 0) {
            datesAvailable.push({
              day: new Date(fecha.toString()),
              hours: slotsDisponibles
            });
          }
        }

        individuals.push({
          employeeId: se.employeeId,
          serviceId: se.serviceId,
          datesAvailable
        });
      }

      let setAvailability: SetAvailability | undefined;

      if (serviciosEmpleados.length === 1) {
        return {
          status: 200,
          message: "Disponibilidad calculada para servicio individual",
          data: { individuals }
        };
      }

      const empleadosUnicos = [...new Set(serviciosEmpleados.map(se => se.employeeId))];
      
      if (empleadosUnicos.length === 1) {
        // Todos los servicios son con el mismo empleado
        const empleadoId = empleadosUnicos[0];
        const empleado = empleados.find(e => e.id === empleadoId)!;
        
        const duracionTotal = serviciosEmpleados.reduce((total, se) => {
          const servicio = servicios.find(s => s.id === se.serviceId)!;
          return total + this.parseDurationToMinutes(servicio.duration);
        }, 0);

        for (const fecha of fechas) {
          const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
          
          if (!horarioBase) continue;

          const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
          const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);

          let startTime = horarioBase.startTime;
          let endTime = horarioBase.endTime;

          if (excepciones) {
            if (!excepciones.isAvailable) continue;
            if (excepciones.startTime && excepciones.endTime) {
              startTime = excepciones.startTime;
              endTime = excepciones.endTime;
            }
          }

          const startMinutes = this.timeToMinutes(startTime);
          const endMinutes = this.timeToMinutes(endTime);

          if (startMinutes + duracionTotal <= endMinutes) {
            const isOccupied = citasOcupadas.some(cita => {
              const citaStart = this.timeToMinutes(cita.start);
              const citaEnd = this.timeToMinutes(cita.end);
              return startMinutes < citaEnd && (startMinutes + duracionTotal) > citaStart;
            });

            if (!isOccupied) {
              const ultimoSlot = this.minutesToTime(startMinutes + duracionTotal);

              const serviceSlots: ServiceSlot[] = [];
              let currentTime = startMinutes;
              
              serviciosEmpleados.forEach((se, index) => {
                const servicio = servicios.find(s => s.id === se.serviceId)!;
                const duracionServicio = this.parseDurationToMinutes(servicio.duration);
                
                serviceSlots.push({
                  serviceId: se.serviceId,
                  employeeId: se.employeeId,
                  startTime: this.minutesToTime(currentTime),
                  endTime: this.minutesToTime(currentTime + duracionServicio),
                  order: index + 1
                });
                
                currentTime += duracionServicio;
              });

              setAvailability = {
                day: new Date(fecha.toString()),
                startHour: startTime,
                endHour: ultimoSlot,
                services: serviceSlots
              };
              break;
            }
          }
        }
      } else {
        for (const fecha of fechas) {
          let puedenTodos = true;
          let horaInicio: string | null = null;
          let horaFin: string | null = null;
          const serviceSlots: ServiceSlot[] = [];

          let horaActual = 8 * 60;

          for (let i = 0; i < serviciosEmpleados.length; i++) {
            const se = serviciosEmpleados[i];
            if (!se) continue;
            
            const servicio = servicios.find(s => s.id === se.serviceId);
            const empleado = empleados.find(e => e.id === se.employeeId);
            
            if (!servicio || !empleado) {
              puedenTodos = false;
              break;
            }
            
            const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
            if (!horarioBase) {
              puedenTodos = false;
              break;
            }

            const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
            const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);
            const duracionServicio = this.parseDurationToMinutes(servicio.duration);
            const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas, duracionServicio);
            
            const horaInicioString = this.minutesToTime(horaActual);
            
            const slotDisponible = slotsDisponibles.includes(horaInicioString);

            if (!slotDisponible) {
              puedenTodos = false;
              break;
            }

            serviceSlots.push({
              serviceId: se.serviceId,
              employeeId: se.employeeId,
              startTime: horaInicioString,
              endTime: this.minutesToTime(horaActual + duracionServicio),
              order: i + 1
            });

            if (!horaInicio) horaInicio = horaInicioString;
            horaActual += duracionServicio;
          }

          if (puedenTodos && horaInicio) {
            horaFin = this.minutesToTime(horaActual);
            setAvailability = {
              day: new Date(fecha.toString()),
              startHour: horaInicio,
              endHour: horaFin,
              services: serviceSlots
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