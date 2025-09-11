"use client";

import { Input } from "@meetzeen/ui/src/components/input";
import { IconSearch } from "@tabler/icons-react";

import { EquipoSheetCreate } from "@/modules/dashboard/equipo/components/equipo-sheet-create";
import { EquipoSheetFilters } from "@/modules/dashboard/equipo/components/equipo-sheet-filters";
import { useEquipoFilters } from "@/modules/dashboard/equipo/store/useEquipoStore";
import { useDebounce } from "@/utils/use-debounce";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export function EquipoFilter() {
  const pathname = usePathname();
  const { search, categoryId, setFilter } = useEquipoFilters();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 750);

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

    const searchParam = params.get("search") || "";
    const categoryParam = params.get("categoryId") || "";
    
    setFilter("search", searchParam);
    setFilter("categoryId", categoryParam);
    setFilter("currentPage", parseInt(params.get("page") || "1", 10));
    
    setSearchInput(searchParam);
  }, [setFilter]);
  
  useEffect(() => {
    setFilter("search", debouncedSearch);
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    updateURL("search", search);
  }, [search, updateURL]);

  useEffect(() => {
    updateURL("categoryId", categoryId);
  }, [categoryId, updateURL]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <EquipoSheetCreate />
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IconSearch className="text-muted-foreground h-5 w-5" />
          </span>
          <Input 
            placeholder="Buscar" 
            className="pl-10" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <EquipoSheetFilters />
      </div>
    </div>
  );
}
