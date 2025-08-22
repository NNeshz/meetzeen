import type { Metadata } from "next";
import { Instrument_Sans, Geist } from "next/font/google";
import "./global.css";
import { AppProviders } from "./app-providers";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"]
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Meetzeen — Organiza tus citas de manera sencilla",
  description: "Ahorra tiempo, no pierdas clientes y conoce tu negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${instrumentSans.variable} ${geist.variable} ${instrumentSans.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}