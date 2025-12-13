"use client";

import { useState } from "react";
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
import { IconCalendar, IconTrash } from "@tabler/icons-react";
import { useTeamCalendar } from "@/modules/team/hooks/use-team";
import { CalendarData } from "@/modules/team/types/team.types";
import { TeamTemplateForm } from "@/modules/team/components/team-template-form";
import { TeamDatesForm } from "@/modules/team/components/team-dates-form";
import { TeamVacationsForm } from "@/modules/team/components/team-vacations-form";
import { Badge } from "@meetzeen/ui/src/components/badge";

export function TeamCalendarSheet({ userId }: { userId: string }) {
  const { data, isLoading, isError, refetch } = useTeamCalendar(userId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const calendarData = data as CalendarData | undefined;
  const days = calendarData?.days || [];

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const normalizeDate = (
    dateValue: string | Date | null | undefined
  ): string => {
    if (!dateValue) return "";

    // Si es un objeto Date, convertirlo a string ISO
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0] || "";
    }

    // Si es string, extraer la fecha después del prefijo "Date:"
    const dateString = String(dateValue);
    if (dateString.startsWith("Date:")) {
      return dateString.replace("Date:", "");
    }

    // Si tiene formato ISO, extraer solo la fecha
    if (dateString.includes("T")) {
      return dateString.split("T")[0] || "";
    }

    return dateString;
  };

  const formatDateToSpanish = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const selectedDay = selectedDate
    ? days.find(
        (day) => normalizeDate(day.date) === formatDateToString(selectedDate)
      )
    : undefined;

  // Función para deshabilitar días que no están en la información
  const isDateDisabled = (date: Date): boolean => {
    const dateString = formatDateToString(date);
    return !days.some((day) => normalizeDate(day.date) === dateString);
  };

  console.log(calendarData);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <IconCalendar className="size-4 mr-2" />
          Calendario
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Calendario del miembro</SheetTitle>
          <SheetDescription>
            Selecciona un día para ver el horario disponible del miembro
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                Cargando calendario...
              </p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-destructive">
                Error al cargar el calendario
              </p>
            </div>
          ) : !calendarData ||
            days.length === 0 ||
            calendarData.template.length === 0 ? (
            <div className="flex flex-col h-64 items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">
                  No hay un horario disponible
                </p>
                <p className="text-sm text-muted-foreground">
                  Crea un horario semanal para el miembro
                </p>
              </div>
              <TeamTemplateForm memberId={userId} />
            </div>
          ) : (
            <>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] w-full"
              />

              {selectedDay && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold capitalize">
                        {formatDateToSpanish(selectedDate!)}
                      </h3>

                      {selectedDay.isWorkingDay &&
                        selectedDay.timeBlocks.length > 0 && (
                          <div className="space-y-3">
                            {selectedDay.timeBlocks.map((block, index) => (
                              <div
                                key={index}
                                className="bg-muted/20 space-y-2"
                              >
                                <Badge>
                                  Horario {index + 1}
                                </Badge>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    Hora de inicio:
                                  </p>
                                  <p className="font-medium">
                                    {block.startTime}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    Hora de fin:
                                  </p>
                                  <p className="font-medium">{block.endTime}</p>
                                </div>
                              </div>
                            ))}
                            <TeamDatesForm
                              currentTimeBlocks={selectedDay.timeBlocks}
                              memberId={userId}
                              selectedDate={selectedDate}
                            />
                          </div>
                        )}

                      {!selectedDay.isWorkingDay &&
                        selectedDay.timeBlocks.length === 0 && (
                          <div className="p-3 border rounded-lg bg-muted/20">
                            <p className="text-sm text-muted-foreground">
                              No hay horarios disponibles para este día
                            </p>
                            <TeamDatesForm
                              currentTimeBlocks={[]}
                              memberId={userId}
                              selectedDate={selectedDate}
                            />
                          </div>
                        )}

                      {selectedDay.reason && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Razón:</span>{" "}
                            {selectedDay.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedDate && !selectedDay && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card space-y-4">
                    <p className="text-sm text-muted-foreground">
                      No hay información disponible para este día
                    </p>
                  </div>
                </div>
              )}

              {!selectedDate && days.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Gestiona los horarios del miembro
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
