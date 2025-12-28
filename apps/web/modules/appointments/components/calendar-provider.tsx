"use client";

import { useAppointments } from "@/modules/appointments/hooks/use-appointments";
import {
  Appointment,
  GroupedAppointments,
  RawAppointment,
} from "@/modules/appointments/types/appointments-types";
import { addDays, addWeeks, subDays, subWeeks } from "date-fns";
import { useMemo, useState } from "react";
import { CalendarHeader, CalendarView } from "./calendar-header";
import { DayView } from "./calendar-day";
import { WeekView } from "./calendar-week";
import { AppointmentSheet } from "./calendar-details";

const COLORS = [
  "bg-teal-100 text-teal-900", 
  "bg-orange-100 text-orange-900",
  "bg-green-100 text-green-900",
  "bg-blue-100 text-blue-900",
];

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("week");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data, isLoading } = useAppointments();

  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Reset appointmentId when sheet closes
      setSelectedAppointmentId(null);
    }
  };

  const appointments = useMemo<Appointment[]>(() => {
    if (!data) return [];

    const now = new Date();

    return (data as unknown as GroupedAppointments[]).flatMap((group) =>
      group.appointments.map((apt: RawAppointment) => {
        const dateStr = apt.appointmentDate.replace("Date:", "");
        const startStr = `${dateStr}T${apt.startTime}`;
        const endStr = `${dateStr}T${apt.endTime}`;
        const endDate = new Date(endStr);

        const colorIndex =
          apt.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
          COLORS.length;

        return {
          id: apt.id,
          start: new Date(startStr).toISOString(),
          end: endDate.toISOString(),
          clientId: undefined,
          clientName: apt.customerName,
          serviceName: undefined,
          color: COLORS[colorIndex],
          isPast: endDate < now,
        };
      })
    );
  }, [data]);

  const handlePrev = () => {
    switch (view) {
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
    <>
      <div className="flex flex-col h-[calc(100vh-100px)] w-full min-w-0 border rounded-lg shadow-sm bg-background overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="flex-1 overflow-hidden relative w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              Loading...
            </div>
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
        </div>
      </div>
      <AppointmentSheet
        appointmentId={selectedAppointmentId}
        open={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        showTrigger={false}
      />
    </>
  );
}
