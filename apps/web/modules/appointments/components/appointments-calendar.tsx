"use client";

import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from "date-fns";
import { useState } from "react";
import { CalendarHeader, CalendarView } from "./calendar-header";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const handlePrev = () => {
    switch (view) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] border rounded-lg shadow-sm bg-background overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <div className="flex-1 overflow-hidden">
        {view === "month" && <MonthView currentDate={currentDate} />}
        {view === "week" && <WeekView currentDate={currentDate} />}
        {view === "day" && <DayView currentDate={currentDate} />}
      </div>
    </div>
  );
}
