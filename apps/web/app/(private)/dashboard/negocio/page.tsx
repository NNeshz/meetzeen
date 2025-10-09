import { Metadata } from "next";
import { Negocio } from "@/modules/dashboard/negocio/negocio";

export const metadata: Metadata = {
  title: "Meetzeen — Negocio",
};

export default function NegocioPage() {
  return <Negocio />;
}
