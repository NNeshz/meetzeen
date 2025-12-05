import { ReactNode } from "react";
import { Navbar } from "@/modules/landing/navbar";
import { Footer } from "@/modules/landing/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetzeen | Inicio",
  description: "Meetzeen es una plataforma de gestión de citas y reservas",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // Puedes agregar un Navbar y Footer aquí
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}