import { Navbar } from "@/modules/landing/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // Puedes agregar un Navbar y Footer aquí
    <div>
      <Navbar />
      {children}
    </div>
  )
}