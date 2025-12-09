"use client";

import * as React from "react";

import { Calendar } from "@meetzeen/ui/components/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconCalendar, IconClock, IconRefresh, IconPlus } from "@tabler/icons-react";
import { useMemberCalendar } from "@/modules/team/hooks/use-team";
import { BaseSchedule } from "@/modules/team/types/team.types";
import { Badge } from "@meetzeen/ui/components/badge";
import { TeamCalendarCreate } from "@/modules/team/components/team-calendar-create";
import { CalendarRepeatForm } from "@/modules/team/components/calendar-repeat-form";
import { IconEdit } from "@tabler/icons-react";

// Mapeo de días de la semana (0=Sunday, 1=Monday, ..., 6=Saturday)
const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

function getDayOfWeek(date: Date): number {
  return date.getDay();
}

function getScheduleForDay(
  schedules: BaseSchedule[],
  dayOfWeek: number
): BaseSchedule[] {
  return schedules.filter((schedule) => schedule.dayOfWeek === dayOfWeek);
}

function hasSchedule(schedules: BaseSchedule[], dayOfWeek: number): boolean {
  return schedules.some((schedule) => schedule.dayOfWeek === dayOfWeek);
}

function formatTime(time: string): string {
  return time.slice(0, 5); // "HH:mm"
}

export function TeamCalendarSheet({ userId }: { userId: string }) {
  const {
    data: calendar,
    isLoading,
    error,
    refetch,
    isEmpty,
  } = useMemberCalendar(userId);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

  const schedules = calendar || [];
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  
  const selectedDaySchedules = date
    ? getScheduleForDay(schedules, getDayOfWeek(date))
    : [];

  const selectedDayOfWeek = date ? getDayOfWeek(date) : 0;

  // Función para obtener los modificadores del calendario
  const modifiers = {
    hasSchedule: (date: Date) => hasSchedule(schedules, getDayOfWeek(date)),
  };

  const modifiersClassNames = {
    hasSchedule: "bg-accent/50",
  };

  const handleEditSubmit = (values: {
    repeatType: "once" | "repeat" | "default" | "remove";
    repeatCount?: number;
    timeSlots?: Array<{
      startHour: number;
      startMinute: number;
      endHour: number;
      endMinute: number;
    }>;
  }) => {
    // Aquí se manejaría la lógica de guardado
    // Por ahora solo UI/UX
    console.log("Form submitted:", values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <IconCalendar className="size-4 mr-2" />
          Ver calendario
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Calendario del miembro</SheetTitle>
          <SheetDescription>
            Selecciona un día para ver el horario disponible del miembro
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4">
          {isLoading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Cargando horarios...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="py-8 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-sm font-medium text-destructive">
                  Error al cargar el calendario
                </p>
                <p className="text-xs text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Ocurrió un error al cargar los horarios"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <IconRefresh className="size-4" />
                  Reintentar
                </Button>
              </div>
            </div>
          ) : isEmpty ? (
            <div className="py-8 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium">
                  No hay horarios configurados
                </p>
                <p className="text-xs text-muted-foreground">
                  Este miembro no tiene horarios base configurados
                </p>
                <TeamCalendarCreate userId={userId} />
              </div>
            </div>
          ) : (
            <>
              <div className="">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] w-full"
                  buttonVariant="ghost"
                />
              </div>

              {date && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {DAY_NAMES[selectedDayOfWeek]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {selectedDaySchedules.length > 0 && (
                      <Badge variant="secondary" className="gap-1.5">
                        <IconClock className="size-3.5" />
                        Disponible
                      </Badge>
                    )}
                  </div>

                  {selectedDaySchedules.length > 0 ? (
                    <>
                      <div className="space-y-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Horarios
                        </p>
                        <div className="space-y-2">
                          {selectedDaySchedules.map((schedule, idx) => (
                            <div
                              key={schedule.id || idx}
                              className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                            >
                              <p className="font-medium text-sm">
                                {formatTime(schedule.startTime)} -{" "}
                                {formatTime(schedule.endTime)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setEditDialogOpen(true)}
                      >
                        <IconEdit className="size-4 mr-2" />
                        Editar horarios
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Este día no tiene horario configurado
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setEditDialogOpen(true)}
                      >
                        <IconPlus className="size-4 mr-2" />
                        Agregar horario
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {date && (
                <CalendarRepeatForm
                  open={editDialogOpen}
                  onOpenChange={setEditDialogOpen}
                  selectedDate={date}
                  dayOfWeek={selectedDayOfWeek}
                  existingSchedule={
                    selectedDaySchedules.length > 0
                      ? selectedDaySchedules.map((schedule) => ({
                          startTime: schedule.startTime,
                          endTime: schedule.endTime,
                        }))
                      : undefined
                  }
                  onSubmit={handleEditSubmit}
                />
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
