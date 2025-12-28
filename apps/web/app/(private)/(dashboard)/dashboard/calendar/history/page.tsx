import { HistoryTable } from "@/modules/appointments/components/history-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial | Meetzeen",
  description: "Gestiona el historial de citas desde aquí.",
};

export default function CalendarHistoryPage() {
  return (
    <div>
      <HistoryTable />
    </div>
  );
}
