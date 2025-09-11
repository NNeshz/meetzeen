"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@meetzeen/ui/src/components/input";
import { IconSearch } from "@tabler/icons-react";
import { useCategoriesFilters } from "@/modules/dashboard/categorias/store/useCategoriesStore";
import { CategoriaSheetCreate } from "@/modules/dashboard/categorias/components/categoria-sheet-create";

export function CategoriasFilter() {
  const pathname = usePathname();
  const { search, setFilter } = useCategoriesFilters();

  const updateURL = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value === "all" || value === "" || value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const newURL = `${pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newURL);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    setFilter("search", params.get("search") || "");
    setFilter("currentPage", parseInt(params.get("page") || "1", 10));
  }, [setFilter]);

  useEffect(() => {
    updateURL("search", search);
  }, [search, updateURL]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter("search", value);
    setFilter("currentPage", 1);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <CategoriaSheetCreate />
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <IconSearch className="text-muted-foreground h-5 w-5" />
        </span>
        <Input
          placeholder="Buscar categorías..."
          className="pl-10"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
