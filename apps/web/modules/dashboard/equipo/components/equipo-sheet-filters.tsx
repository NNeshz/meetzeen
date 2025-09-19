"use client";

import { Button } from "@meetzeen/ui/src/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@meetzeen/ui/src/components/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@meetzeen/ui/src/components/sheet";
import { IconX, IconChevronDown, IconAdjustments } from "@tabler/icons-react";
import { useEquipoFilters } from "@/modules/dashboard/equipo/store/useEquipoStore";
import { useCategoriasQuery } from "@/modules/dashboard/categorias/hooks/useCategorias";

import { useState } from "react";

interface Category {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function EquipoSheetFilters() {
  const { search, categoryId, setFilter, resetFilters } = useEquipoFilters();
  const { data: categoriasData } = useCategoriasQuery();

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const handleClearFilters = () => {
    resetFilters();
  };

  const hasActiveFilters = search || categoryId;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8">
          <IconAdjustments className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Aplica filtros para refinar la búsqueda.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-2">
          <Collapsible onOpenChange={setIsCategoryOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex w-full items-center justify-between p-0 font-medium text-foreground hover:bg-transparent"
              >
                <span className="text-sm">Filtrar por categoría</span>
                <IconChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              <div className="grid gap-2">
                <button
                  onClick={() => setFilter("categoryId", "")}
                  className={`flex items-center justify-start rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    !categoryId
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted/50"
                  }`}
                >
                  Todas las categorías
                </button>
                {categoriasData?.data?.map((categoria: Category) => (
                  <button
                    key={categoria.id}
                    onClick={() => setFilter("categoryId", categoria.id)}
                    className={`flex items-center justify-start rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                      categoryId === categoria.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted/50"
                    }`}
                  >
                    {categoria.name}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                <IconX className="h-4 w-4 mr-2" />
                Limpiar todos los filtros
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
