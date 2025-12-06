import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Meetzeen",
  description: "Dashboard de Meetzeen",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="font-geist">{children}</div>;
}
