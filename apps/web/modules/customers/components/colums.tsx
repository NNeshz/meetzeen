"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/modules/customers/types/customer.types";
import { Button } from "@meetzeen/ui/components/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";
import { CustomersUpdate } from "@/modules/customers/components/customers-update";
import { CustomersDelete } from "@/modules/customers/components/customers-delete";
import { Avatar, AvatarFallback } from "@meetzeen/ui/components/avatar";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "avatar",
    header: () => <div className="max-w-[42px] text-center">Avatar</div>,
    cell: ({ row }) => {
      const customer = row.original;
      const name = customer.name.split(" ")[0];
      const lastName = customer.lastName.split(" ")[0];
      return (
        <div className="max-w-[42px] flex items-center justify-center">
          <Avatar className="size-8 rounded-none max-w-[40px]">
            <AvatarFallback className="bg-brand text-black rounded-none">
              {name?.charAt(0)}
              {lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const customer = row.original;

      // Función para capitalizar cada parte del nombre/apellido
      function capitalizeWords(text?: string) {
        if (!text) return "";
        return text
          .split(" ")
          .filter(Boolean)
          .map(
            part =>
              part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .join(" ");
      }

      const formattedName = capitalizeWords(customer.name);
      const formattedLastName = capitalizeWords(customer.lastName);

      return (
        <div className="font-medium min-w-48">
          {formattedName} {formattedLastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="text-sm min-w-48">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Teléfono",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string | null;
      return (
        <div className="text-sm text-muted-foreground min-w-32">
          {phoneNumber || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAppointments",
    header: "Citas",
    cell: ({ row }) => {
      const total = row.getValue("totalAppointments") as number;
      return <div className="text-sm font-medium">{total}</div>;
    },
  },
  {
    accessorKey: "lastAppointmentDate",
    header: "Última cita",
    cell: ({ row }) => {
      const date = row.getValue("lastAppointmentDate") as string | null;
      if (!date) {
        return <div className="text-sm text-muted-foreground min-w-32">-</div>;
      }
      return (
        <div className="text-sm text-muted-foreground min-w-32">
          {new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-[150px]">
              <CustomersUpdate
                id={customer.id}
                name={customer.name}
                lastName={customer.lastName}
                email={customer.email}
                phoneNumber={customer.phoneNumber || ""}
              />
              <CustomersDelete
                id={customer.id}
                name={customer.name}
                email={customer.email}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
