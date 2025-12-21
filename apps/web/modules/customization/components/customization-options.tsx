import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@meetzeen/ui/components/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@meetzeen/ui/src/components/select";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconSettings } from "@tabler/icons-react";

export function CustomizationOptions() {
  return (
    <Sheet>
      <SheetTrigger asChild className="relative z-50 top-4 left-4">
        <Button variant="outline">
          <IconSettings className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Opciones de Personalización</SheetTitle>
          <SheetDescription>
            Personaliza tu configuración de la aplicación.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Opción 1</SelectItem>
              <SelectItem value="2">Opción 2</SelectItem>
              <SelectItem value="3">Opción 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SheetContent>
    </Sheet>
  );
}
