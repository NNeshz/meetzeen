import { Appointment } from "@/modules/appointments/types/appointments-types";
import { calculateLayout } from "../utils/layout-utils";
import { cn } from "@meetzeen/ui/src/lib/utils";
import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useRef } from "react";

interface WeekViewProps {
  currentDate: Date;
  appointments?: Appointment[];
}


export function WeekView({ currentDate, appointments = [] }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = 60; // Approximate height of one hour block
      scrollRef.current.scrollTop = 8 * hourHeight;
    }
  }, []);

  const getDayAppointments = (day: Date) => {
    if (!appointments) return [];

    // Filter appointments for this day
    const dayAppointments = appointments.filter((apt) =>
      isSameDay(new Date(apt.start), day)
    );

    // Calculate layout
    return calculateLayout(dayAppointments);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex border-b">
        <div className="w-16 flex-shrink-0 border-r bg-muted/5" /> {/* Time column header */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "py-2 text-center border-r last:border-r-0 flex items-center justify-center gap-2",
                isToday(day) ? "bg-brand/5" : ""
              )}
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

      {/* Time Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex relative min-h-[1440px] py-10"> {/* 24h * 60px */}
          {/* Time Labels */}
          <div className="w-16 flex-shrink-0 border-r bg-muted/5 flex flex-col">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b text-xs text-muted-foreground text-right pr-2 pt-1 relative"
              >
                <span className="-top-2.5 relative bg-background px-1">
                  {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          <div className="flex-1 grid grid-cols-7">
            {days.map((day) => {
              const dayApts = getDayAppointments(day);
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "border-r last:border-r-0 relative",
                    isToday(day) ? "bg-primary/5" : ""
                  )}
                >
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={cn(
                        "h-[60px] border-b border-dashed",
                        hour === 0 && "border-t border-dashed"
                      )}
                    />
                  ))}

                  {/* Render Appointments */}
                  {dayApts.map((apt) => (
                    <div
                      key={apt.id}
                      className="absolute bg-primary/20 border border-primary/50 rounded px-1 overflow-hidden hover:z-20 transition-all text-[10px] leading-tight"
                      style={{
                        top: `${apt.top}px`,
                        height: `${apt.height}px`,
                        left: `${apt.left}%`,
                        width: `${apt.width}%`,
                      }}
                    >
                      <div className="font-semibold truncate">{apt.title || "Cita"}</div>
                      <div className="truncate">{apt.clientName || "Cliente"}</div>
                      <div className="truncate text-muted-foreground">
                        {format(new Date(apt.start), "HH:mm")} - {format(new Date(apt.end), "HH:mm")}
                      </div>
                    </div>
                  ))}

                  {/* Current Time Indicator (if today) */}
                  {isToday(day) && (
                    <CurrentTimeIndicator />
                  )}
                </div>
              )
            })}
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
  )
}
