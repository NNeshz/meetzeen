import { ReactNode } from "react";
import { Navbar } from "@/modules/landing/navbar";
import { Footer } from "@/modules/landing/footer";

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