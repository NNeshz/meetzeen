"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/modules/customers/types/customer.types";
import { Badge } from "@meetzeen/ui/components/badge";
import { Button } from "@meetzeen/ui/components/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="font-medium min-w-48">
          {customer.name} {customer.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="text-sm min-w-48">{row.getValue("email")}</div>
      );
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
      return (
        <div className="text-sm font-medium">
          {total}
        </div>
      );
    },
  },
  {
    accessorKey: "lastAppointmentDate",
    header: "Última cita",
    cell: ({ row }) => {
      const date = row.getValue("lastAppointmentDate") as string | null;
      if (!date) {
        return (
          <div className="text-sm text-muted-foreground min-w-32">-</div>
        );
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
              {/* Aquí puedes agregar acciones como editar, eliminar, etc. */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
