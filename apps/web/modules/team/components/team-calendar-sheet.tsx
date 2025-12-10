"use client";

import { Calendar } from "@meetzeen/ui/components/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconCalendar } from "@tabler/icons-react";

export function TeamCalendarSheet({ userId }: { userId: string }) {
  console.log("📅 TeamCalendarSheet userId:", userId);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <IconCalendar className="size-4 mr-2" />
          Ver calendario
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl font-geist overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SheetHeader>
          <SheetTitle>Calendario del miembro</SheetTitle>
          <SheetDescription>
            Selecciona un día para ver el horario disponible del miembro
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Calendar
            mode="single"
            className="border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] w-full"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
