import { Appointment } from "@/modules/appointments/types/appointments-types";
import { cn } from "@meetzeen/ui/src/lib/utils";
import { format, isSameDay, isToday, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useMemo, useRef } from "react";
import { calculateLayout } from "../utils/layout-utils";

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

interface DayViewProps {
  currentDate: Date;
  appointments?: Appointment[];
  zoom?: number;
  onAppointmentClick?: (appointmentId: string) => void;
}

export function DayView({
  currentDate,
  appointments = [],
  zoom,
  onAppointmentClick,
}: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 240; // h-60 equivalent
  const pixelsPerMinute = hourHeight / 60;

  // Scroll to 8 AM on mount
  useEffect(() => {
    // Only scroll on mount
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      scrollRef.current.scrollTop = 8 * hourHeight;
    }
  }, []);

  const dayAppointments = useMemo(() => {
    if (!appointments) return [];
    const filtered = appointments.filter((apt) => {
      const startDate = safeParseDate(apt.start);
      return startDate ? isSameDay(startDate, currentDate) : false;
    });
    return calculateLayout(filtered);
  }, [appointments, currentDate]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex border-b">
        <div className="w-16 flex-shrink-0 border-r bg-muted/5" />
        <div className="flex-1 py-2 flex items-center justify-center gap-2">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            {format(currentDate, "EEEE", { locale: es })}
          </div>
          <div
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
              isToday(currentDate) ? "bg-brand text-black" : "text-foreground"
            )}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      </div>

      {/* Time Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="flex relative py-10"
          style={{ minHeight: `${24 * hourHeight}px` }}
        >
          {/* Time Labels */}
          <div className="w-16 flex-shrink-0 border-r bg-muted/5 flex flex-col">
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

          {/* Grid Column */}
          <div className="flex-1 relative">
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

            {/* Appointments */}
            {dayAppointments.map((apt) => {
              const showDetails = apt.height > 30; // Threshold for showing details

              return (
                <div
                  key={apt.id}
                  onClick={() => onAppointmentClick?.(apt.id)}
                  className={cn(
                    "absolute rounded p-2 overflow-hidden hover:z-20 transition-all text-xs cursor-pointer hover:opacity-90 hover:shadow-md",
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
                        "font-light text-[10px] truncate",
                        apt.isPast ? "text-muted-foreground" : "text-current/70"
                      )}
                    >
                      {safeFormatTime(apt.start)} -{" "}
                      {safeFormatTime(apt.end)}
                    </div>
                  )}
                </div>
              );
            })}

            {isToday(currentDate) && <CurrentTimeIndicator />}
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
