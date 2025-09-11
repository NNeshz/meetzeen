import { ServiciosHeader } from "@/modules/dashboard/servicios/servicios-header";
import { ServiciosFilter } from "@/modules/dashboard/servicios/servicios-filter";
import { ServiciosTable } from "@/modules/dashboard/servicios/servicios-table";
import { ServiciosPagination } from "@/modules/dashboard/servicios/servicios-pagintation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetzeen — Servicios",
};

export default function ServiciosPage() {
  return (
    <div className="space-y-4">
      <ServiciosHeader />
      <ServiciosFilter />
      <ServiciosTable />
      <ServiciosPagination />
    </div>
  );
}
