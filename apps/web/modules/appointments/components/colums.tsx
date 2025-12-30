"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RawAppointment } from "@/modules/appointments/types/appointments-types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@meetzeen/ui/components/dropdown-menu";
import { Button } from "@meetzeen/ui/components/button";
import { IconDots, IconEye } from "@tabler/icons-react";
import { HistoryDetails } from "@/modules/appointments/components/history-details";
import { useState } from "react";

function ActionsCell({ appointmentId }: { appointmentId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      <HistoryDetails
        appointmentId={appointmentId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        showTrigger={false}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <IconDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-[150px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSheetOpen(true);
            }}
          >
            <IconEye className="size-4" />
            Ver detalles
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<RawAppointment>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
    cell: ({ row }) => {
      return (
        <div className="font-medium min-w-48">
          {row.getValue("customerName")}
        </div>
      );
    },
  },
  {
    accessorKey: "appointmentDate",
    header: "Fecha",
    cell: ({ row }) => {
      const dateStr = row.getValue("appointmentDate") as string;
      const date = dateStr.replace("Date:", "");
      const dateObj = new Date(date + "T00:00:00");

      return (
        <div className="text-sm min-w-32">
          {dateObj.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Hora de inicio",
    cell: ({ row }) => {
      const time = row.getValue("startTime") as string;
      const formattedTime = time.length > 5 ? time.substring(0, 5) : time;
      return (
        <div className="text-sm font-medium min-w-24">{formattedTime}</div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "Hora de fin",
    cell: ({ row }) => {
      const time = row.getValue("endTime") as string;
      const formattedTime = time.length > 5 ? time.substring(0, 5) : time;
      return (
        <div className="text-sm font-medium min-w-24">{formattedTime}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell appointmentId={row.original.id} />;
    },
  },
];
