import { CategoriasHeader } from "@/modules/dashboard/categorias/categorias-header";
import { CategoriasFilter } from "@/modules/dashboard/categorias/categorias-filter";
import { CategoriasCards } from "@/modules/dashboard/categorias/categorias-cards";
import { CategoriasPagination } from "@/modules/dashboard/categorias/categorias-pagination";

export default function CategoriasPage() {
  return (
    <div className="space-y-4">
      <CategoriasHeader />
      <CategoriasFilter />
      <CategoriasCards />
      <CategoriasPagination />
    </div>
  );
}
