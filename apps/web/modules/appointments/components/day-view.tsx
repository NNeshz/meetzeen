import { cn } from "@meetzeen/ui/src/lib/utils";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useRef } from "react";

interface DayViewProps {
  currentDate: Date;
}

export function DayView({ currentDate }: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = 60;
      scrollRef.current.scrollTop = 8 * hourHeight;
    }
  }, []);

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
              isToday(currentDate)
                ? "bg-brand text-black"
                : "text-foreground"
            )}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      </div>

      {/* Time Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex relative min-h-[1440px] py-10">
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

          {/* Grid Column */}
          <div className="flex-1 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className={cn(
                  "h-[60px] border-b border-dashed",
                  hour === 0 && "border-t border-dashed"
                )}
              />
            ))}
            {isToday(currentDate) && (
              <CurrentTimeIndicator />
            )}
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
