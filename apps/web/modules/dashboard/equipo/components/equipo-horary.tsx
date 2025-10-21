"use client";

import * as React from "react";
import { Temporal } from "temporal-polyfill";
import { Calendar } from "@meetzeen/ui/src/components/calendar";
import { IconLoader } from "@tabler/icons-react";
import { useEmployeeAvailabilityQuery } from "@/modules/dashboard/equipo/hooks/useEquipo";

type Slot = { startTime: string; endTime: string };
type AvailabilityDay = { date: string | Date; dayOfWeek: number; slots: Slot[] };

function toPlainDate(val: unknown): Temporal.PlainDate | undefined {
  const tz = Temporal.Now.timeZoneId();
  try {
    if (val instanceof Date) {
      // Si el Date parece ser una fecha ISO convertida automáticamente por Eden,
      // extraer la fecha original del string ISO
      const isoString = val.toISOString();
      if (isoString.endsWith("T00:00:00.000Z")) {
        // Es una fecha ISO que fue convertida automáticamente
        const [dateOnly] = isoString.split("T"); // asegura 'string' (no 'string | undefined')
        return Temporal.PlainDate.from(dateOnly!);
      }
      // Para otros casos, usar componentes locales
      return Temporal.PlainDate.from({
        year: val.getFullYear(),
        month: val.getMonth() + 1,
        day: val.getDate(),
      });
    }
    if (typeof val === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return Temporal.PlainDate.from(val);
      }
      if (val.includes("T")) {
        const inst = Temporal.Instant.from(val);
        return inst.toZonedDateTimeISO(tz).toPlainDate();
      }
      return Temporal.PlainDate.from(val);
    }
  } catch {}
  return undefined;
}

function plainDateToYMD(pd?: Temporal.PlainDate): string | undefined {
  return pd?.toString(); // YYYY-MM-DD
}

function ymdToCalendarDate(ymd?: string): Date | undefined {
  if (!ymd) return undefined;
  try {
    const pd = Temporal.PlainDate.from(ymd);
    // Crear Date local (evita desplazamientos por UTC)
    return new Date(pd.year, pd.month - 1, pd.day);
  } catch {
    return undefined;
  }
}

function dateToPlainDate(d?: Date): Temporal.PlainDate | undefined {
  if (!d) return undefined;
  // Derivar PlainDate de componentes locales del Date
  return Temporal.PlainDate.from({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  });
}

export function EquipoHorary({
  employeeId,
  employeeName,
  enabled = true,
}: {
  employeeId: string;
  employeeName?: string;
  enabled?: boolean;
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const { data, isLoading, isError } = useEmployeeAvailabilityQuery(employeeId, {
    months: 6,
    enabled,
  });

  const availability = (data?.data?.availability ?? []) as AvailabilityDay[];
    
  const range = data?.data?.range;

  const fromDate = ymdToCalendarDate(range?.startDate);
  const toDate = ymdToCalendarDate(range?.endDate);

  const availabilityByDay = React.useMemo(() => {
    const map = new Map<string, AvailabilityDay>();
    for (const day of availability) {
      const pd =
        typeof day.date === "string"
          ? toPlainDate(day.date)
          : toPlainDate(day.date as Date);
      const key = plainDateToYMD(pd);
      if (key) map.set(key, day);
    }
    return map;
  }, [availability]);

  const selectedPlain = dateToPlainDate(selectedDate);
  const selectedKey = plainDateToYMD(selectedPlain);
  const selectedSlots: Slot[] = selectedKey
    ? availabilityByDay.get(selectedKey)?.slots ?? []
    : [];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">
        Horario de {employeeName ?? "Empleado"}
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="w-full"
        classNames={{ root: "w-full" }}
        fromDate={fromDate}
        toDate={toDate}
      />

      {isLoading && (
        <div className="flex items-center justify-center">
          <IconLoader className="h-5 w-5 animate-spin text-brand" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="text-sm text-destructive">
          Error al cargar la disponibilidad
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {selectedDate ? (
            <>
              <div className="text-sm text-muted-foreground">
                {selectedKey}
              </div>
              {selectedSlots.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Horario vacío
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedSlots.map((slot, idx) => (
                    <span
                      key={`${selectedKey}-${idx}`}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Selecciona una fecha para ver el horario.
            </div>
          )}
        </div>
      )}
    </div>
  );
}