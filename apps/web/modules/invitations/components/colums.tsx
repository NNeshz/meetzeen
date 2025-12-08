"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invitation } from "@/modules/invitations/types/invitation.types";
import { Badge } from "@meetzeen/ui/components/badge";
import { Button } from "@meetzeen/ui/components/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {role || "Sin rol"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusVariant =
        status === "pending" ? "secondary" : status === "accepted" ? "default" : "destructive";
      const statusLabel =
        status === "pending" ? "Pendiente" : status === "accepted" ? "Aceptada" : "Rechazada";
      return <Badge variant={statusVariant}>{statusLabel}</Badge>;
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expira",
    cell: ({ row }) => {
      const expiresAt = row.getValue("expiresAt") as string;
      const date = new Date(expiresAt);
      const now = new Date();
      const isExpired = date < now;
      
      return (
        <div className={`text-sm ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
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
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const invitation = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-[150px]">
              <DropdownMenuItem>
                Reenviar invitación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
