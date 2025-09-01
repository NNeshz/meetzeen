import { Metadata } from "next";
import { SectionCompany } from "@/modules/dashboard/negocio/section-company";

export const metadata: Metadata = {
  title: "Meetzeen — Negocio",
};

export default function NegocioPage() {
  return (
    <div>
      <SectionCompany />
    </div>
  );
}
