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
import { es } from "date-fns/locale";

interface MonthViewProps {
  currentDate: Date;
}

export function MonthView({ currentDate }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

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
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[100px] border-b border-r p-2 transition-colors hover:bg-muted/50 relative group",
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
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                    !isCurrentMonth && !isToday(day) && "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              {/* Event placeholders would go here */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
