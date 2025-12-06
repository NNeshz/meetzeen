import { ServicesTable } from "@/modules/services/components/services-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | Meetzeen",
  description: "Gestiona todos tus servicios desde aquí.",
};

export default function ServicesPage() {
  return (
    <div className="space-y-4">
      <ServicesTable />
    </div>
  );
}