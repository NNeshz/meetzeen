"use client";

import { useAppointments } from "@/modules/appointments/hooks/use-appointments";
import { Appointment, GroupedAppointments, RawAppointment } from "@/modules/appointments/types/appointments-types";
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from "date-fns";
import { useMemo, useState } from "react";
import { CalendarHeader, CalendarView } from "./calendar-header";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const { data, isLoading } = useAppointments();

  const appointments = useMemo<Appointment[]>(() => {
    if (!data) return [];
    
    // Data is GroupedAppointments[]
    return (data as unknown as GroupedAppointments[]).flatMap((group) => 
      group.appointments.map((apt: RawAppointment) => {
        const dateStr = apt.appointmentDate.replace("Date:", "");
        // Ensure time has seconds for consistent parsing, though usually optional
        // Input: "09:00" or "09:50:00"
        const startStr = `${dateStr}T${apt.startTime}`;
        const endStr = `${dateStr}T${apt.endTime}`;

        return {
          id: apt.id,
          title: apt.notes || "Cita", 
          start: new Date(startStr).toISOString(),
          end: new Date(endStr).toISOString(),
          employeeId: apt.memberId,
          clientId: undefined,
          clientName: apt.customerName,
          serviceName: undefined,
          status: "CONFIRMED", // Default mapping since raw status is lowercase "scheduled"
          color: undefined
        };
      })
    );
  }, [data]);

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
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            Loading...
          </div>
        )}
        {view === "month" && <MonthView currentDate={currentDate} appointments={appointments} />}
        {view === "week" && <WeekView currentDate={currentDate} appointments={appointments} />}
        {view === "day" && <DayView currentDate={currentDate} appointments={appointments} />}
      </div>
    </div>
  );
}
