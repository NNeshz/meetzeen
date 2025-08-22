import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { AppProviders } from "./app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}