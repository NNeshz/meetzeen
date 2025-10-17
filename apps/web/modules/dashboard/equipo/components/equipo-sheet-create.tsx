"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@meetzeen/ui/src/components/sheet";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconLoader, IconPlus } from "@tabler/icons-react";

import { useCategoriasQuery } from "@/modules/dashboard/categorias/hooks/useCategorias";
import { EquipoCreate } from "./equipo-create";

export function EquipoSheetCreate() {
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategoriasQuery();

  const categoriesData = categories?.data || [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="brand" size={"sm"} >
          <IconPlus className="h-5 w-5" />
          Agregar empleado
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Agregar miembro</SheetTitle>
          <SheetDescription>
            Completa la información del miembro para agregarlo al equipo.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isLoadingCategories && <Loading />}
          {!isLoadingCategories && !isErrorCategories && (
            <EquipoCreate categories={categoriesData} />
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