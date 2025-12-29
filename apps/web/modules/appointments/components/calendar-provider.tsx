"use client";

import { useAppointments } from "@/modules/appointments/hooks/use-appointments";
import {
  Appointment,
  GroupedAppointments,
  RawAppointment,
} from "@/modules/appointments/types/appointments-types";
import { Temporal } from "@js-temporal/polyfill";
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
  const [currentDate, setCurrentDate] = useState(() => Temporal.Now.plainDateISO());
  const [view, setView] = useState<CalendarView>("week");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, isLoading } = useAppointments(currentDate);

  const currentDateAsDate = useMemo(() => {
    return new Date(currentDate.year, currentDate.month - 1, currentDate.day);
  }, [currentDate]);

  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedAppointmentId(null);
    }
  };

  const appointments = useMemo<Appointment[]>(() => {
    if (!data) return [];

    const now = Temporal.Now.zonedDateTimeISO();

    return (data as unknown as GroupedAppointments[]).flatMap((group) =>
      group.appointments.map((apt: RawAppointment) => {
        const dateStr = apt.appointmentDate.replace("Date:", "");
        const startDateTime = Temporal.PlainDateTime.from(`${dateStr}T${apt.startTime}`);
        const endDateTime = Temporal.PlainDateTime.from(`${dateStr}T${apt.endTime}`);
        
        const endZoned = endDateTime.toZonedDateTime(now.timeZoneId);
        const isPast = Temporal.ZonedDateTime.compare(endZoned, now) < 0;

        const colorIndex =
          apt.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
          COLORS.length;

        return {
          id: apt.id,
          start: startDateTime.toString(),
          end: endDateTime.toString(),
          clientId: undefined,
          clientName: apt.customerName,
          serviceName: undefined,
          color: COLORS[colorIndex],
          isPast,
        };
      })
    );
  }, [data]);

  const handlePrev = () => {
    switch (view) {
      case "week":
        setCurrentDate(currentDate.subtract({ weeks: 1 }));
        break;
      case "day":
        setCurrentDate(currentDate.subtract({ days: 1 }));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "week":
        setCurrentDate(currentDate.add({ weeks: 1 }));
        break;
      case "day":
        setCurrentDate(currentDate.add({ days: 1 }));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(Temporal.Now.plainDateISO());
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-100px)] w-full min-w-0 border rounded-lg shadow-sm bg-background overflow-hidden">
        <CalendarHeader
          currentDate={currentDateAsDate}
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
              currentDate={currentDateAsDate}
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDateAsDate}
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
