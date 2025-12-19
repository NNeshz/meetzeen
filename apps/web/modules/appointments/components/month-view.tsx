import { Appointment } from "@/modules/appointments/types/appointments-types";
import { cn } from "@meetzeen/ui/src/lib/utils";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

interface MonthViewProps {
  currentDate: Date;
  appointments?: Appointment[];
}

export function MonthView({ currentDate, appointments = [] }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const getDayAppointments = (day: Date) => {
    return appointments?.filter(apt => isSameDay(new Date(apt.start), day)) || [];
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayAppointments = getDayAppointments(day);

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[100px] border-b border-r p-2 transition-colors hover:bg-muted/50 relative group flex flex-col gap-1",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                // Remove right border for last column
                (dayIdx + 1) % 7 === 0 && "border-r-0"
              )}
            >
              <div className="flex items-center justify-center sm:justify-start">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday(day)
                      ? "bg-brand text-black"
                      : "text-foreground",
                    !isCurrentMonth && !isToday(day) && "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Event List */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="text-[10px] bg-primary/10 text-primary truncate px-1 rounded border border-primary/20">
                    {format(new Date(apt.start), "HH:mm")} {apt.title || "Cita"}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-[10px] text-muted-foreground pl-1">
                    + {dayAppointments.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
