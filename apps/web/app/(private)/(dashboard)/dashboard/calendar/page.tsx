import { AppointmentsCalendar } from "@/modules/appointments/components/calendar-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendario | Meetzeen",
  description: "Calendario",
};

export default function CalendarPage() {
  return (
    <div className="h-full">
      <AppointmentsCalendar />
    </div>
  );
}