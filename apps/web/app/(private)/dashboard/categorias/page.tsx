import { CategoriasHeader } from "@/modules/dashboard/categorias/categorias-header";
import { CategoriasFilter } from "@/modules/dashboard/categorias/categorias-filter";
import { CategoriasTable } from "@/modules/dashboard/categorias/categorias-table";
import { CategoriasPagination } from "@/modules/dashboard/categorias/categorias-pagination";

export default function CategoriasPage() {
  return (
    <div className="space-y-4">
      <CategoriasHeader />
      <CategoriasFilter />
      <CategoriasTable />
      <CategoriasPagination />
    </div>
  );
}
