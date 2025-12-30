import { Appointment } from "@/modules/appointments/types/appointments-types";
import { calculateLayout } from "../utils/layout-utils";
import { cn } from "@meetzeen/ui/src/lib/utils";
import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  isValid,
  parseISO,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useRef } from "react";

function safeParseDate(dateValue: string | Date | null | undefined): Date | null {
  if (!dateValue) return null;
  try {
    const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

function safeFormatTime(dateValue: string | Date | null | undefined, fallback = "--:--"): string {
  const date = safeParseDate(dateValue);
  if (!date) return fallback;
  try {
    return format(date, "HH:mm");
  } catch {
    return fallback;
  }
}

interface WeekViewProps {
  currentDate: Date;
  appointments?: Appointment[];
  zoom?: number;
  onAppointmentClick?: (appointmentId: string) => void;
}

export function WeekView({ currentDate, appointments = [], zoom, onAppointmentClick }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 240; // h-60 equivalent
  const pixelsPerMinute = hourHeight / 60;

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      scrollRef.current.scrollTop = 8 * hourHeight;
    }
  }, []);

  const getDayAppointments = (day: Date) => {
    if (!appointments) return [];

    // Filter appointments for this day
    const dayAppointments = appointments.filter((apt) => {
      const startDate = safeParseDate(apt.start);
      return startDate ? isSameDay(startDate, day) : false;
    });

    // Calculate layout
    return calculateLayout(dayAppointments);
  };

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden bg-background">
      {/* Scrollable Container (Both X and Y) */}
      <div ref={scrollRef} className="flex-1 overflow-auto shadow-inner">
        <div className="flex flex-col">
          {/* Sticky Header */}
          <div className="flex sticky top-0 z-30 bg-background border-b shadow-sm">
            {/* Corner - Sticky Left */}
            <div className="w-16 shrink-0 sticky left-0 z-40 bg-background border-r" />

            {/* Days Header */}
            <div className="flex flex-1">
              {days.map((day) => (
                <div
                  key={day.toString()}
                  className="flex-1 py-2 text-center border-r last:border-r-0 flex items-center justify-center gap-2 bg-background"
                  style={{ minWidth: "160px" }}
                >
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    {format(day, "EEE", { locale: es })}
                  </div>
                  <div
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                      isToday(day)
                        ? "bg-brand text-black"
                        : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Grid Body */}
          <div
            className="flex relative"
            style={{ minHeight: `${24 * hourHeight}px` }}
          >
            {/* Time Labels - Sticky Left */}
            <div className="w-16 shrink-0 sticky left-0 z-20 bg-background border-r flex flex-col">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="border-b text-xs text-muted-foreground text-right pr-2 pt-1 relative"
                  style={{ height: `${hourHeight}px` }}
                >
                  <span className="-top-2.5 relative bg-background px-1">
                    {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Columns */}
            <div className="flex flex-1">
              {days.map((day) => {
                const dayApts = getDayAppointments(day);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "flex-1 border-r last:border-r-0 relative",
                      isToday(day) ? "bg-primary/5" : ""
                    )}
                    style={{ minWidth: "160px" }}
                  >
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className={cn(
                          "border-b border-dashed",
                          hour === 0 && "border-t border-dashed"
                        )}
                        style={{ height: `${hourHeight}px` }}
                      />
                    ))}

                    {/* Render Appointments */}
                    {dayApts.map((apt) => {
                      const showDetails = apt.height > 30;

                      return (
                        <div
                          key={apt.id}
                          onClick={() => onAppointmentClick?.(apt.id)}
                          className={cn(
                            "absolute rounded p-2 overflow-hidden hover:z-20 transition-all text-[10px] leading-tight cursor-pointer hover:opacity-90 hover:shadow-md",
                            apt.color
                          )}
                          style={{
                            top: `${apt.top * pixelsPerMinute}px`,
                            height: `${apt.height * pixelsPerMinute}px`,
                            left: `${apt.left}%`,
                            width: `${apt.width}%`,
                          }}
                        >
                          <div className="font-semibold truncate">
                            {apt.clientName || "Cliente"}
                          </div>
                          {showDetails && (
                            <div
                              className={cn(
                                "truncate font-light",
                                apt.isPast
                                  ? "text-muted-foreground"
                                  : "text-current/70"
                              )}
                            >
                              {safeFormatTime(apt.start)} -{" "}
                              {safeFormatTime(apt.end)}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Current Time Indicator (if today) */}
                    {isToday(day) && <CurrentTimeIndicator />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = (minutes / 1440) * 100; // Percentage of day

  return (
    <div
      className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none flex items-center"
      style={{ top: `${top}%` }}
    >
      <div className="h-2 w-2 rounded-full bg-red-500 -ml-1" />
    </div>
  );
}
