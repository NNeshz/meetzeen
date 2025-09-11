import { EquipoHeader } from "@/modules/dashboard/equipo/equipo-header";
import { EquipoTable } from "@/modules/dashboard/equipo/equipo-table";
import { EquipoFilter } from "@/modules/dashboard/equipo/equipo-filter";
import { EquipoPagination } from "@/modules/dashboard/equipo/equipo-pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetzeen - Equipo",
};

export default function EquipoPage() {
  return (
    <div className="space-y-4">
      <EquipoHeader />
      <EquipoFilter />
      <EquipoTable />
      <EquipoPagination />
    </div>
  );
}
