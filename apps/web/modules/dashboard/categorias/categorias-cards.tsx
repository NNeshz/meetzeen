"use client";

import { useCategoriasQuery } from "@/modules/dashboard/categorias/hooks/useCategorias";
import { useEffect } from "react";

import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";
import { Empty } from "@/modules/dashboard/components/empty";

import { CategoriasCard } from "@/modules/dashboard/categorias/components/categoria-card";
import { useCategoriesFilters } from "./store/useCategoriesStore";

export function CategoriasCards() {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useCategoriasQuery();
  const { setPagination } = useCategoriesFilters();

  useEffect(() => {
    if (categories?.pagination) {
      const { currentPage, totalPages } = categories.pagination;
      setPagination(currentPage, totalPages);
    }
  }, [categories?.pagination, setPagination]);

  if (isLoading) {
    return (
      <Loading message={["Cargando categorías...", "Solo un momento más..."]} />
    );
  }

  if (isError) {
    return <Error message="Error al cargar las categorías" retry={refetch} />;
  }

  if (!isLoading && !isError && categories?.data?.length === 0) {
    return <Empty message="No hay categorías" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 auto-rows-fr">
      {categories?.data?.map((categoria) => (
        <CategoriasCard key={categoria.id} categoria={categoria} />
      ))}
    </div>
  );
}
