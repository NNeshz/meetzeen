import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { IconEdit } from "@tabler/icons-react";
import { DropdownMenuItem } from "@meetzeen/ui/src/components/dropdown-menu";
import { CategoriaUpdate } from "@/modules/dashboard/categorias/components/categoria-update";

export function CategoriaSheetUpdate({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <Sheet>
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
          <SheetTitle>Actualizar categoria</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <CategoriaUpdate id={id} name={name} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
