import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@meetzeen/ui/src/components/sheet";
import { DropdownMenuItem } from "@meetzeen/ui/src/components/dropdown-menu";
import { IconEdit, IconLoader } from "@tabler/icons-react";

import { useCategoriasQuery } from "@/modules/dashboard/categorias/hooks/useCategorias";
import { EquipoUpdate } from "./equipo-update";

interface Employee {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  phoneNumber: string;
  imageUrl: string | null;
  categories: {
    name: string;
    id: string;
  }[];
}

export function EquipoSheetUpdate({ employee }: { employee: Employee }) {

  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategoriasQuery();

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
        <div className="px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isLoadingCategories && <Loading />}
          {!isLoadingCategories && !isErrorCategories && (
            <EquipoUpdate categories={categoriesData?.data || []} employee={employee} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <IconLoader className="h-5 w-5 animate-spin text-brand" />
    </div>
  );
}