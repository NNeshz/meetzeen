import { CustomersTable } from "@/modules/customers/components/customers-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes | Meetzeen",
  description: "Gestiona tus clientes desde aquí.",
};

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <CustomersTable />
    </div>
  );
}
