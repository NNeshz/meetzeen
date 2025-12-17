"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "@/modules/services/types/service.types";
import { Badge } from "@meetzeen/ui/components/badge";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@meetzeen/ui/src/components/dropdown-menu";
import { ServiceUpdateSheet } from "@/modules/services/components/service-update";
import { ServiceDeleteDialog } from "@/modules/services/components/service-delete";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div className="font-medium min-w-56">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description || "Sin descripción"}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") as string);
      return (
        <div className="font-medium">
          $
          {price.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duración",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      if (hours > 0 && minutes > 0) {
        return (
          <div>
            {hours}h {minutes}m
          </div>
        );
      } else if (hours > 0) {
        return <div>{hours}h</div>;
      } else {
        return <div>{minutes}m</div>;
      }
    },
  },
  {
    accessorKey: "discount",
    header: "Descuento",
    cell: ({ row }) => {
      const discount = row.getValue("discount") as number | null;
      if (discount === null || discount === 0) {
        return <div className="text-muted-foreground">-</div>;
      }
      return <Badge variant="secondary">{discount}%</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-sm text-muted-foreground min-w-32">
          {date.toLocaleDateString("es-ES", {
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
      const service = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-[150px]">
              <ServiceUpdateSheet service={service} />
              <ServiceDeleteDialog service={service} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
