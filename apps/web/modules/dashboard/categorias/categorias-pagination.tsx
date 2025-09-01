import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Button } from "@meetzeen/ui/src/components/button";

export function CategoriasPagination() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="hover:bg-transparent">
        <IconChevronsLeft className="size-4" />
      </Button>
      <Button variant="outline" size="icon" className="hover:bg-transparent">
        <IconChevronLeft className="size-4" />
      </Button>
      <span>Pagina 1 de 1</span>
      <Button variant="outline" size="icon" className="hover:bg-transparent">
        <IconChevronRight className="size-4" />
      </Button>
      <Button variant="outline" size="icon" className="hover:bg-transparent">
        <IconChevronsRight className="size-4" />
      </Button>
    </div>
  );
}
