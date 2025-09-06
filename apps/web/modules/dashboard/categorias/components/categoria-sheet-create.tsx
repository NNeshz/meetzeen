import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconPlus } from "@tabler/icons-react";
import { CategoriaCreate } from "@/modules/dashboard/categorias/components/categoria-create";

export function CategoriaSheetCreate() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <IconPlus className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Agregar categoria</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <CategoriaCreate />
        </div>
      </SheetContent>
    </Sheet>
  );
}
