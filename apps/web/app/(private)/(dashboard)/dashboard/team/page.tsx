import { TeamTable } from "@/modules/team/components/team-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo | Meetzeen",
  description: "Gestiona tu equipo de trabajo desde aquí.",
};

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <TeamTable />
    </div>
  );
}