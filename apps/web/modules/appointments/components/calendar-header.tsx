import { Button } from "@meetzeen/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export type CalendarView = "day" | "week";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-b">
      <div className="flex items-center justify-between sm:justify-start gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrev}>
            <IconChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <IconChevronRight className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold capitalize min-w-[140px] text-center sm:text-left">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={onToday} className="hidden sm:flex">
          Hoy
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" onClick={onToday} className="sm:hidden flex-1">
          Hoy
        </Button>

        <Select value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Día</SelectItem>
            <SelectItem value="week">Semana</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
