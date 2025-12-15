"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Team } from "@/modules/team/types/team.types";
import { Badge } from "@meetzeen/ui/components/badge";
import { Button } from "@meetzeen/ui/components/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@meetzeen/ui/components/avatar";
import { TeamCalendarSheet } from "./team-calendar-sheet";

function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  if (words[0]) {
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    const first = words[0]?.charAt(0) ?? "";
    const second = words[1]?.charAt(0) ?? "";
    return (first + second).toUpperCase();
  }

  return "";
}

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Miembro",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 rounded-none">
            <AvatarImage src={team.image || undefined} alt={team.name} className="rounded-none" />
            <AvatarFallback className="rounded-none bg-brand text-black">{getInitials(team.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{team.name}</div>
            <div className="text-sm text-muted-foreground">{team.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant="secondary" className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de ingreso",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-sm text-muted-foreground min-w-[150px]">
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
      const team = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <TeamCalendarSheet userId={team.id} />
              <DropdownMenuItem className="text-destructive">
                Remover del equipo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
