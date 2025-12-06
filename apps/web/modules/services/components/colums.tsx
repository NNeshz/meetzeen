"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "@/modules/services/types/service.types";
import { Badge } from "@meetzeen/ui/components/badge";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("name")}</div>
      );
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
          ${price.toLocaleString("es-ES", {
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
        return <div>{hours}h {minutes}m</div>;
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
      return (
        <Badge variant="secondary">
          {discount}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
];

