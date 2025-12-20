import { AppointmentTable } from "@/modules/appointments/components/appointment-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial | Meetzeen",
  description: "Gestiona el historial de citas desde aquí.",
};

export default function CalendarHistoryPage() {
  return (
    <div>
      <AppointmentTable />
    </div>
  );
}
