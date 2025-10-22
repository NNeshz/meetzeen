"use client";

import * as React from "react";
import { Temporal } from "temporal-polyfill";
import { Calendar } from "@meetzeen/ui/src/components/calendar";
import { IconLoader, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@meetzeen/ui/components/button";
import { ButtonGroup } from "@meetzeen/ui/src/components/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@meetzeen/ui/src/components/select";
import { toast } from "sonner";
import {
  useConditionalUpdateEmployeeSchedulesMutation,
  useEmployeeAvailabilityQuery,
  useEmployeeSchedulesQuery,
  useReplaceEmployeeDaySchedulesMutation,
} from "@/modules/dashboard/equipo/hooks/useEquipo";
import { Checkbox } from "@meetzeen/ui/src/components/checkbox";
import { Input } from "@meetzeen/ui/src/components/input";

type Slot = { startTime: string; endTime: string };
type AvailabilityDay = { date: string | Date; dayOfWeek: number; slots: Slot[] };

function toPlainDate(val: unknown): Temporal.PlainDate | undefined {
  const tz = Temporal.Now.timeZoneId();
  try {
    if (val instanceof Date) {
      const iso = val.toISOString();
      if (iso.endsWith("T00:00:00.000Z")) {
        return Temporal.PlainDate.from(iso.split("T")[0]!);
      }
      return Temporal.PlainDate.from({
        year: val.getFullYear(),
        month: val.getMonth() + 1,
        day: val.getDate(),
      });
    }
    if (typeof val === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return Temporal.PlainDate.from(val);
      if (val.includes("T")) {
        return Temporal.Instant.from(val).toZonedDateTimeISO(tz).toPlainDate();
      }
      return Temporal.PlainDate.from(val);
    }
  } catch {}
  return undefined;
}

function ymdToCalendarDate(ymd?: string): Date | undefined {
  if (!ymd) return undefined;
  try {
    const pd = Temporal.PlainDate.from(ymd);
    return new Date(pd.year, pd.month - 1, pd.day);
  } catch {
    return undefined;
  }
}

function dateToPlainDate(d?: Date): Temporal.PlainDate | undefined {
  if (!d) return undefined;
  return Temporal.PlainDate.from({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  });
}

// ===== inputs y utilidades de horario (como equipo-create) =====
const DAYS = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
] as const;
type DayKey = (typeof DAYS)[number]["key"];

const DAY_KEY_TO_INDEX: Record<DayKey, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 7,
};
const INDEX_TO_DAY_KEY: Record<number, DayKey> = {
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
  7: "domingo",
};

type UISchedulesByDay = {
  lunes: Array<{ start: string; end: string }>;
  martes: Array<{ start: string; end: string }>;
  miercoles: Array<{ start: string; end: string }>;
  jueves: Array<{ start: string; end: string }>;
  viernes: Array<{ start: string; end: string }>;
  sabado: Array<{ start: string; end: string }>;
  domingo: Array<{ start: string; end: string }>;
};

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const pad = (n: number) => String(n).padStart(2, "0");
const formatTime = (h: number, m: number) => `${pad(h)}:${pad(m)}`;
const parseTime = (t?: string) => {
  const [h, m] = (t ?? "00:00").split(":");
  return { hour: Number(h) || 0, minute: Number(m) || 0 };
};
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Mapa de índice de día (1-7) a etiqueta
const DAY_INDEX_TO_LABEL: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

// Obtiene el índice de día (1-7, Lunes=1 ... Domingo=7) desde un Date local
function dateToDayIndexLocal(d?: Date): number | null {
  if (!d) return null;
  const js = d.getDay(); // 0-6 (Domingo=0)
  return [7, 1, 2, 3, 4, 5, 6][js] ?? null;
}

function flattenSchedules(schedules: UISchedulesByDay) {
  const result: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
  (Object.keys(DAY_KEY_TO_INDEX) as Array<DayKey>).forEach((key) => {
    const dayIndex = DAY_KEY_TO_INDEX[key];
    schedules[key].forEach((t) => {
      result.push({
        dayOfWeek: dayIndex,
        startTime: t.start,
        endTime: t.end,
      });
    });
  });
  return result;
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

  const availabilityByDay = React.useMemo(
    () =>
      availability.reduce((map, day) => {
        const key = toPlainDate(day.date)?.toString();
        if (key) map.set(key, day);
        return map;
      }, new Map<string, AvailabilityDay>()),
    [availability]
  );

  const selectedKey = dateToPlainDate(selectedDate)?.toString();
  const selectedSlots: Slot[] = selectedKey
    ? availabilityByDay.get(selectedKey)?.slots ?? []
    : [];

  // ===== estado y carga de horarios existentes =====
  const { data: schedulesResp, isLoading: schedulesLoading, refetch: refetchSchedules } =
    useEmployeeSchedulesQuery(employeeId);
  const [dayShifts, setDayShifts] = React.useState<Array<{ start: string; end: string }>>([]);

  // NUEVO: controles de actualización condicional (mutuamente excluyentes)
  const [onlyThisDay, setOnlyThisDay] = React.useState<boolean>(true);
  const [repeatEnabled, setRepeatEnabled] = React.useState<boolean>(false);
  const [repeatWeeks, setRepeatWeeks] = React.useState<number>(0);

  const dayIndex = dateToDayIndexLocal(selectedDate);
  const dayLabel = dayIndex ? DAY_INDEX_TO_LABEL[dayIndex] : null;

  React.useEffect(() => {
    if (!dayIndex) {
      setDayShifts([]);
      return;
    }
    const entries = (schedulesResp as any)?.data ?? [];
    const currentDay = Array.isArray(entries)
      ? entries.filter((e: { dayOfWeek: number }) => e.dayOfWeek === dayIndex)
      : [];
    const next = currentDay.map((e: { startTime: string; endTime: string }) => ({
      start: e.startTime,
      end: e.endTime,
    }));
    setDayShifts(next);
  }, [schedulesResp, dayIndex]);

  function addShift() {
    setDayShifts((prev) => [...prev, { start: "08:00", end: "17:00" }]);
  }

  function updateShiftPart(
    index: number,
    part: "start" | "end",
    next: { hour?: number; minute?: number }
  ) {
    setDayShifts((prev) => {
      const cur = prev[index];
      if (!cur) return prev;
      const { hour, minute } = parseTime(cur[part]);
      const newHour = next.hour ?? hour;
      const newMinute = next.minute ?? minute;
      const updated = prev.map((t, i) =>
        i === index ? { ...t, [part]: formatTime(newHour, newMinute) } : t
      );
      return updated;
    });
  }

  function removeShift(index: number) {
    setDayShifts((prev) => prev.filter((_, i) => i !== index));
  }

  const { mutate: conditionalUpdate, isPending: savingConditional } =
    useConditionalUpdateEmployeeSchedulesMutation();

  function handleSaveDay() {
    const ymd = dateToPlainDate(selectedDate)?.toString();
    const wantsSpecificDates = onlyThisDay || repeatEnabled;

    if (wantsSpecificDates && !ymd) {
      toast.error("Selecciona una fecha para guardar.");
      return;
    }

    if (repeatEnabled && repeatWeeks < 1) {
      toast.error("Ingresa al menos 1 semana para repetir.");
      return;
    }

    for (const t of dayShifts) {
      if (!timeRegex.test(t.start) || !timeRegex.test(t.end)) {
        toast.error("Formato de hora inválido. Usa HH:mm (24h).");
        return;
      }
      if (t.start >= t.end) {
        toast.error("La hora de fin debe ser mayor que la de inicio.");
        return;
      }
    }

    const schedulesPayload = dayShifts.map((t, idx) => ({
      startTime: t.start,
      endTime: t.end,
      order: idx + 1,
      isActive: true,
    }));

    conditionalUpdate(
      {
        id: employeeId,
        selectedDate: wantsSpecificDates ? ymd : undefined,
        schedules: schedulesPayload,
        onlyThisDay: onlyThisDay || undefined,
        repeatWeeks: repeatEnabled && repeatWeeks > 0 ? repeatWeeks : undefined,
      },
      {
        onSuccess: () => {
          const targetText =
            repeatEnabled && repeatWeeks > 0
              ? `por ${repeatWeeks} semana(s)`
              : onlyThisDay
              ? "solo para esta fecha"
              : "aplicado a todos los días";
          toast.success(`Horarios ${targetText} guardados ✅`);
          refetchSchedules();
        },
      }
    );
  }

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
        <div className="text-sm text-destructive">Error al cargar la disponibilidad</div>
      )}

      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {dayLabel ? `Editar horarios de ${dayLabel}` : "Selecciona un día para editar"}
          </div>
          <Button
            onClick={handleSaveDay}
            disabled={
              savingConditional ||
              (!dayIndex && !onlyThisDay && !repeatEnabled) ||
              ((onlyThisDay || repeatEnabled) && !selectedDate) ||
              dayShifts.length === 0
            }
          >
            {savingConditional ? (
              <>
                <IconLoader className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>

        {/* Controles de actualización condicional: columna, usando Checkbox/Input de UI */}
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <label className="flex items-center gap-3 text-sm">
            <Checkbox
              checked={onlyThisDay}
              onCheckedChange={(checked) => {
                const isChecked = Boolean(checked);
                setOnlyThisDay(isChecked);
                if (isChecked) {
                  // si se selecciona "Solo esta fecha", desactivar "Repetir"
                  setRepeatEnabled(false);
                  setRepeatWeeks(0);
                }
              }}
              aria-label="Solo esta fecha"
            />
            <span>Solo esta fecha</span>
          </label>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 text-sm">
              <Checkbox
                checked={repeatEnabled}
                onCheckedChange={(checked) => {
                  const isChecked = Boolean(checked);
                  setRepeatEnabled(isChecked);
                  if (isChecked) {
                    // si se selecciona "Repetir", desactivar "Solo esta fecha"
                    setOnlyThisDay(false);
                  } else {
                    // al desactivar repetir, limpiar semanas
                    setRepeatWeeks(0);
                  }
                }}
                aria-label="Repetir"
              />
              <span>Repetir</span>
            </label>

            {repeatEnabled && (
              <div className="max-w-[160px]">
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={repeatWeeks}
                  onChange={(e) =>
                    setRepeatWeeks(
                      Math.max(1, Math.min(52, parseInt(e.target.value || "1", 10)))
                    )
                  }
                  aria-label="Repetir semanas"
                />
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            Si no seleccionas ninguna opción, se aplica a todos los días.
          </span>
        </div>

        {schedulesLoading && (
          <div className="flex items-center justify-center">
            <IconLoader className="h-5 w-5 animate-spin text-brand" />
          </div>
        )}

        {!schedulesLoading && dayIndex && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{dayLabel}</span>
              <Button type="button" size="sm" variant="outline" onClick={addShift}>
                <IconPlus className="h-4 w-4 mr-1" />
                Añadir Turno
              </Button>
            </div>

            {dayShifts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Sin turnos. Añade uno para este día.
              </p>
            )}

            {dayShifts.map((turno, idx) => {
              const s = parseTime(turno.start);
              const e = parseTime(turno.end);
              return (
                <div key={idx} className="flex items-center gap-3 py-2 w-full">
                  <ButtonGroup className="w-full flex-1">
                    <Select
                      value={String(s.hour)}
                      onValueChange={(v) =>
                        updateShiftPart(idx, "start", { hour: parseInt(v, 10) })
                      }
                    >
                      <SelectTrigger className="w-full" data-slot="select-trigger">
                        {pad(s.hour)} h
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS_24.map((h) => (
                          <SelectItem key={h} value={String(h)}>
                            {pad(h)} h
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(s.minute)}
                      onValueChange={(v) =>
                        updateShiftPart(idx, "start", { minute: parseInt(v, 10) })
                      }
                    >
                      <SelectTrigger className="w-full" data-slot="select-trigger">
                        {pad(s.minute)} m
                      </SelectTrigger>
                      <SelectContent>
                        {MINUTES.map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {pad(m)} m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ButtonGroup>

                  <span className="text-muted-foreground">a</span>

                  <ButtonGroup className="w-full flex-1">
                    <Select
                      value={String(e.hour)}
                      onValueChange={(v) =>
                        updateShiftPart(idx, "end", { hour: parseInt(v, 10) })
                      }
                    >
                      <SelectTrigger className="w-full" data-slot="select-trigger">
                        {pad(e.hour)} h
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS_24.map((h) => (
                          <SelectItem key={h} value={String(h)}>
                            {pad(h)} h
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(e.minute)}
                      onValueChange={(v) =>
                        updateShiftPart(idx, "end", { minute: parseInt(v, 10) })
                      }
                    >
                      <SelectTrigger className="w-full" data-slot="select-trigger">
                        {pad(e.minute)} m
                      </SelectTrigger>
                      <SelectContent>
                        {MINUTES.map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {pad(m)} m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ButtonGroup>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeShift(idx)}
                    className="ml-auto"
                    aria-label="Eliminar turno"
                  >
                    <IconTrash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}