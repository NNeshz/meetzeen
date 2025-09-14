import { prismaClient } from "@meetzeen/api/src/modules/prisma";
import { Temporal } from 'temporal-polyfill';

export interface ServicioSolicitado {
  id: string;
  categoryId: string;
  duration: string;
  name?: string;
}

export interface SlotIndividual {
  servicioId: string;
  empleadoId: string;
  empleadoNombre: string;
  fecha: string;
  slots: string[];
}

export interface StepCombinado {
  servicioId: string;
  servicioNombre?: string;
  empleadoId: string;
  empleadoNombre: string;
  start: string;
  end: string;
}

export interface SlotCombinado {
  fecha: string;
  empleadoId?: string;
  steps: StepCombinado[];
}

export interface ResultadoDisponibilidad {
  individual: SlotIndividual[];
  combinado: SlotCombinado[];
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
   * Obtiene empleados que pueden realizar un servicio por categoría
   */
  private async obtenerEmpleadosPorCategoria(categoryId: string, organizationId: string) {
    return await prismaClient.employee.findMany({
      where: {
        organizationId,
        categories: {
          some: {
            id: categoryId
          }
        }
      },
      include: {
        schedules: true,
        exceptions: true,
        categories: true
      }
    });
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
   * Suma duraciones de todos los servicios
   */
  private sumarDuraciones(servicios: ServicioSolicitado[]): number {
    return servicios.reduce((total, servicio) => {
      return total + this.parseDurationToMinutes(servicio.duration);
    }, 0);
  }

  /**
   * Divide un bloque de tiempo en pasos de servicios
   */
  private dividirBloqueEnServicios(
    bloque: { start: string; empleadoId: string; empleadoNombre: string },
    servicios: ServicioSolicitado[]
  ): StepCombinado[] {
    const pasos: StepCombinado[] = [];
    let horaActual = this.timeToMinutes(bloque.start);
    
    for (const servicio of servicios) {
      const duracion = this.parseDurationToMinutes(servicio.duration);
      pasos.push({
        servicioId: servicio.id,
        servicioNombre: servicio.name,
        empleadoId: bloque.empleadoId,
        empleadoNombre: bloque.empleadoNombre,
        start: this.minutesToTime(horaActual),
        end: this.minutesToTime(horaActual + duracion)
      });
      horaActual += duracion;
    }
    
    return pasos;
  }

  /**
   * Busca un slot que inicie exactamente en la hora esperada
   */
  private buscarSlotQueInicieExacto(
    slotsServicio: SlotIndividual[],
    horaEsperada: number
  ): SlotIndividual | null {
    const horaEsperadaString = this.minutesToTime(horaEsperada);
    
    return slotsServicio.find(slot => 
      slot.slots.includes(horaEsperadaString)
    ) || null;
  }

  /**
   * Función principal para calcular disponibilidad
   */
  async calcularDisponibilidad(
    serviciosSolicitados: ServicioSolicitado[],
    organizationId: string
  ): Promise<{
    status: number;
    message: string;
    data: ResultadoDisponibilidad | null;
  }> {
    try {

      console.log('Servicios socilitados:', serviciosSolicitados);
      console.log('Organization ID:', organizationId);

      // 1. Validar entrada
      if (!serviciosSolicitados || serviciosSolicitados.length === 0) {
        throw new Error("Debe seleccionar al menos un servicio");
      }

      if (!organizationId) {
        throw new Error("Se requiere el ID de la organización");
      }

      const resultado: ResultadoDisponibilidad = {
        individual: [],
        combinado: []
      };

      // 2. Generar rango de fechas: hoy + 21 días
      const fechas = this.generarFechasProximosDias(21);
      console.log('Fechas generadas:', fechas.length);

      // 3. Para cada servicio → encontrar empleados que pueden hacerlo
      for (const servicio of serviciosSolicitados) {
        console.log(`\n=== Procesando servicio: ${servicio.name} (ID: ${servicio.id}) ===`);
        console.log('Category ID:', servicio.categoryId);
        
        const empleados = await this.obtenerEmpleadosPorCategoria(
          servicio.categoryId,
          organizationId
        );

        console.log(`Empleados encontrados para categoría ${servicio.categoryId}:`, empleados.length);
        
        if (empleados.length === 0) {
          console.log(`⚠️  No se encontraron empleados para la categoría: ${servicio.categoryId}`);
          continue;
        }

        // Log de empleados encontrados
        empleados.forEach(emp => {
          console.log(`- Empleado: ${emp.name} (ID: ${emp.id})`);
          console.log(`  Horarios: ${emp.schedules?.length || 0}`);
          console.log(`  Categorías: ${emp.categories?.map(c => c.id).join(', ') || 'ninguna'}`);
        });

        // 4. Calcular disponibilidad de cada empleado
        for (const empleado of empleados) {
          console.log(`\n--- Procesando empleado: ${empleado.name} ---`);
          
          for (const fecha of fechas) {
            const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
            
            if (!horarioBase) {
              console.log(`Sin horario para ${empleado.name} el día ${fecha.dayOfWeek} (${fecha.toString()})`);
              continue;
            }

            console.log(`Horario base para ${fecha.toString()}:`, {
              startTime: horarioBase.startTime,
              endTime: horarioBase.endTime,
              dayOfWeek: horarioBase.dayOfWeek
            });

            const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
            const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);

            console.log('Excepciones:', excepciones);
            console.log('Citas ocupadas:', citasOcupadas.length);

            const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas);
            console.log(`Slots disponibles generados: ${slotsDisponibles.length}`);
            
            if (slotsDisponibles.length > 0) {
              console.log('Primeros 3 slots:', slotsDisponibles.slice(0, 3));
            }

            const duracionServicio = this.parseDurationToMinutes(servicio.duration);
            console.log(`Duración del servicio: ${duracionServicio} minutos`);
            
            const slotsValidos = this.filtrarSlotsPorDuracion(slotsDisponibles, duracionServicio);
            console.log(`Slots válidos después del filtrado: ${slotsValidos.length}`);

            if (slotsValidos.length > 0) {
              console.log(`✅ Agregando ${slotsValidos.length} slots para ${empleado.name} el ${fecha.toString()}`);
              resultado.individual.push({
                servicioId: servicio.id,
                empleadoId: empleado.id,
                empleadoNombre: empleado.name || 'Sin nombre',
                fecha: fecha.toString(),
                slots: slotsValidos
              });
            } else {
              console.log(`❌ No hay slots válidos para ${empleado.name} el ${fecha.toString()}`);
            }
          }
        }
      }

      console.log(`\n=== RESUMEN FINAL ===`);
      console.log(`Slots individuales encontrados: ${resultado.individual.length}`);
      console.log(`Slots combinados encontrados: ${resultado.combinado.length}`);

      // 5. Escenario A: mismo empleado puede realizar todos los servicios
      const todosLosEmpleados = await prismaClient.employee.findMany({
        where: {
          organizationId
        },
        include: {
          schedules: true,
          exceptions: true,
          categories: true
        }
      });

      for (const empleado of todosLosEmpleados) {
        // Verificar si puede hacer todos los servicios
        const puedeHacerTodos = serviciosSolicitados.every(servicio => 
          empleado.categories?.some(cat => cat.id === servicio.categoryId) || false
        );

        if (!puedeHacerTodos) continue;

        for (const fecha of fechas) {
          const horarioBase = this.obtenerHorarioEmpleado(empleado, fecha.dayOfWeek);
          if (!horarioBase) continue;

          const excepciones = this.obtenerExcepcionesEmpleado(empleado, fecha);
          const citasOcupadas = await this.obtenerCitasEmpleado(empleado.id, fecha);
          const slotsDisponibles = this.construirSlots(horarioBase, excepciones, citasOcupadas);

          const duracionTotal = this.sumarDuraciones(serviciosSolicitados);
          const slotsContinuos = this.filtrarSlotsPorDuracion(slotsDisponibles, duracionTotal);

          for (const slot of slotsContinuos) {
            const steps = this.dividirBloqueEnServicios(
              {
                start: slot,
                empleadoId: empleado.id,
                empleadoNombre: empleado.name || 'Sin nombre'
              },
              serviciosSolicitados
            );

            resultado.combinado.push({
              fecha: fecha.toString(),
              empleadoId: empleado.id,
              steps
            });
          }
        }
      }

      // 6. Escenario B: encadenar diferentes empleados
      if (serviciosSolicitados.length > 1) {
        for (const fecha of fechas) {
          const fechaString = fecha.toString();
          const primerServicio = serviciosSolicitados[0];
          if (!primerServicio) continue;
          
          const siguientesServicios = serviciosSolicitados.slice(1);

          const slotsIniciales = resultado.individual.filter(x => 
            x.servicioId === primerServicio.id && x.fecha === fechaString
          );

          for (const slotInicial of slotsIniciales) {
            for (const slotStart of slotInicial.slots) {
              let horaActual = this.timeToMinutes(slotStart) + this.parseDurationToMinutes(primerServicio.duration);
              const secuencia: StepCombinado[] = [{
                servicioId: primerServicio.id,
                servicioNombre: primerServicio.name,
                empleadoId: slotInicial.empleadoId,
                empleadoNombre: slotInicial.empleadoNombre,
                start: slotStart,
                end: this.minutesToTime(this.timeToMinutes(slotStart) + this.parseDurationToMinutes(primerServicio.duration))
              }];
              let valido = true;

              for (const servicio of siguientesServicios) {
                const slotsServicio = resultado.individual.filter(x => 
                  x.servicioId === servicio.id && x.fecha === fechaString
                );

                const slotEncontrado = this.buscarSlotQueInicieExacto(slotsServicio, horaActual);

                if (slotEncontrado) {
                  const duracionServicio = this.parseDurationToMinutes(servicio.duration);
                  secuencia.push({
                    servicioId: servicio.id,
                    servicioNombre: servicio.name,
                    empleadoId: slotEncontrado.empleadoId,
                    empleadoNombre: slotEncontrado.empleadoNombre,
                    start: this.minutesToTime(horaActual),
                    end: this.minutesToTime(horaActual + duracionServicio)
                  });
                  horaActual += duracionServicio;
                } else {
                  valido = false;
                  break;
                }
              }

              if (valido) {
                resultado.combinado.push({
                  fecha: fechaString,
                  steps: secuencia
                });
              }
            }
          }
        }
      }

      return {
        status: 200,
        message: `Disponibilidad calculada: ${resultado.individual.length} slots individuales, ${resultado.combinado.length} slots combinados`,
        data: resultado
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