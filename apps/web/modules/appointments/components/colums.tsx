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
import { Badge } from "@meetzeen/ui/src/components/badge";
import { getAppointmentStatusBadgeColor } from "@/modules/appointments/utils/badge-color";
import { APPOINTMENT_STATUS_LABELS } from "@/modules/appointments/constants/appointment-status";

function ActionsCell({
  appointmentId,
  onViewDetails,
}: {
  appointmentId: string;
  onViewDetails: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <IconDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onViewDetails(appointmentId);
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

export function createColumns(
  onViewDetails: (id: string) => void
): ColumnDef<RawAppointment>[] {
  return [
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="text-sm min-w-24 max-w-24">
            <Badge
              variant="secondary"
              className={getAppointmentStatusBadgeColor(status)}
            >
              {APPOINTMENT_STATUS_LABELS[
                status as keyof typeof APPOINTMENT_STATUS_LABELS
              ] || status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Cliente",
      cell: ({ row }) => {
        const customerName = row.getValue("customerName") as string | undefined;

        function formatFullName(fullName?: string) {
          if (!fullName || fullName.trim() === "") return "";
          return fullName
            .split(" ")
            .filter(Boolean)
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ");
        }

        const displayName = formatFullName(customerName);

        if (!displayName) {
          return <div className="text-sm min-w-48">Sin nombre</div>;
        }
        return <div className="font-medium min-w-48">{displayName}</div>;
      },
    },
    {
      accessorKey: "appointmentDate",
      header: "Fecha",
      cell: ({ row }) => {
        const dateStr = row.getValue("appointmentDate") as string;
        if (!dateStr) {
          return <div className="text-sm min-w-32">Sin fecha</div>;
        }
        const date = dateStr.replace("Date:", "");
        const dateObj = new Date(date + "T00:00:00");

        if (isNaN(dateObj.getTime())) {
          return <div className="text-sm min-w-32">Fecha inválida</div>;
        }

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
      accessorKey: "horary",
      header: "Horario",
      cell: ({ row }) => {
        const appointment = row.original;
        const startTime = appointment.startTime
          ? appointment.startTime.length > 5
            ? appointment.startTime.substring(0, 5)
            : appointment.startTime
          : "--:--";
        const endTime = appointment.endTime
          ? appointment.endTime.length > 5
            ? appointment.endTime.substring(0, 5)
            : appointment.endTime
          : "--:--";
        return (
          <div className="text-sm font-medium font-geist-mono min-w-24">
            {startTime} - {endTime}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <ActionsCell
            appointmentId={row.original.id}
            onViewDetails={onViewDetails}
          />
        );
      },
    },
  ];
}
