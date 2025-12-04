import { Geist_Mono, Geist } from "next/font/google";
import "./global.css";
import { AppProviders } from "./app-providers";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${geistMono.className} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
