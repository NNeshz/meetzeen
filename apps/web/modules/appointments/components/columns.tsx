"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RawAppointment } from "@/modules/appointments/types/appointments-types";

export const columns: ColumnDef<RawAppointment>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
    cell: ({ row }) => {
      return <div className="font-medium min-w-48">{row.getValue("customerName")}</div>;
    },
  },
  {
    accessorKey: "appointmentDate",
    header: "Fecha",
    cell: ({ row }) => {
      const dateStr = row.getValue("appointmentDate") as string;
      // Remove "Date:" prefix if present
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
      // Format time to HH:MM if it includes seconds
      const formattedTime = time.length > 5 ? time.substring(0, 5) : time;
      return <div className="text-sm font-medium min-w-24">{formattedTime}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: "Hora de fin",
    cell: ({ row }) => {
      const time = row.getValue("endTime") as string;
      // Format time to HH:MM if it includes seconds
      const formattedTime = time.length > 5 ? time.substring(0, 5) : time;
      return <div className="text-sm font-medium min-w-24">{formattedTime}</div>;
    },
  },
];

