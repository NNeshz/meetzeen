import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { IconEdit } from "@tabler/icons-react";
import { DropdownMenuItem } from "@meetzeen/ui/src/components/dropdown-menu";
import { ServicioUpdate } from "@/modules/dashboard/servicios/components/servicios-update";
import { useState } from "react";

interface ServicioSheetUpdateProps {
  id: string;
  name: string;
  duration: string;
  price: number;
  categoryId: string;
}

export function ServicioSheetUpdate({
  id,
  name,
  duration,
  price,
  categoryId,
}: ServicioSheetUpdateProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <IconEdit className="size-4" />
          <span>Editar</span>
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Actualizar servicio</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <ServicioUpdate 
            id={id}
            name={name}
            duration={duration}
            price={price}
            categoryId={categoryId}
            onSuccess={handleSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}