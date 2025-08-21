import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./global.css";
import { AppProviders } from "./app-providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
      <body className={`${geist.variable} ${geist.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}