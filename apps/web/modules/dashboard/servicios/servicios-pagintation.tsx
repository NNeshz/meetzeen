"use client"

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Button } from "@meetzeen/ui/src/components/button";

import { useServiciosFilters } from "@/modules/dashboard/servicios/store/useServiciosStore";

export function ServiciosPagination() {
  const { currentPage, totalPages, setFilter } = useServiciosFilters();

  if(totalPages <= 1) {
    return null;
  }

  const goToFirstPage = () => {
    if (currentPage > 1) {
      setFilter('currentPage', 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setFilter('currentPage', currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setFilter('currentPage', currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage < totalPages) {
      setFilter('currentPage', totalPages);
    }
  };

  // Estados de deshabilitado
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="hover:bg-transparent"
        onClick={goToFirstPage}
        disabled={isFirstPage}
      >
        <IconChevronsLeft className="size-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="hover:bg-transparent"
        onClick={goToPreviousPage}
        disabled={isFirstPage}
      >
        <IconChevronLeft className="size-4" />
      </Button>
      
      <span>Página {currentPage} de {totalPages}</span>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="hover:bg-transparent"
        onClick={goToNextPage}
        disabled={isLastPage}
      >
        <IconChevronRight className="size-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="hover:bg-transparent"
        onClick={goToLastPage}
        disabled={isLastPage}
      >
        <IconChevronsRight className="size-4" />
      </Button>
    </div>
  );
}