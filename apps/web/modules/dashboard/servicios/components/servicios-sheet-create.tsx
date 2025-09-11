import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconPlus } from "@tabler/icons-react";
import { ServicioCreate } from "@/modules/dashboard/servicios/components/servicios-create";

export function ServiciosSheetCreate() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="brand" size={"sm"}>
          <IconPlus className="h-5 w-5" /> Agregar servicio
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Agregar servicio</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <ServicioCreate />
        </div>
      </SheetContent>
    </Sheet>
  );
}