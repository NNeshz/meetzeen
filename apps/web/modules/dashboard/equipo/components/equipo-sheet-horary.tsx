"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { IconCalendar } from "@tabler/icons-react";
import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";
import { DropdownMenuItem } from "@meetzeen/ui/src/components/dropdown-menu";
import { useEmployeeAvailabilityQuery } from "@/modules/dashboard/equipo/hooks/useEquipo";
import { useState } from "react";
import { EquipoHorary } from "./equipo-horary";

export function EquipoSheetHorary({
  employeeId,
  employeeName,
}: {
  employeeId: string;
  employeeName?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useEmployeeAvailabilityQuery(
    employeeId,
    { months: 6, enabled: open }
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <IconCalendar className="size-4" />
          <span>Ver horario</span>
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Horario de {employeeName ?? "Empleado"}</SheetTitle>
          <SheetDescription>
            Disponibilidades para los próximos 6 meses.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-4">
          {isLoading && <Loading />}
          {!isLoading && isError && <Error />}
          {!isLoading && !isError && (
            <EquipoHorary
              employeeId={employeeId}
              employeeName={employeeName}
              enabled={open}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}