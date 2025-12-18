"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useAllCustomers } from "@/modules/customers/hooks/use-customers";
import { columns } from "./colums";
import { Customer } from "@/modules/customers/types/customer.types";
import { Input } from "@meetzeen/ui/components/input";
import { IconSearch, IconRefresh, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";
import { Button } from "@meetzeen/ui/components/button";
import { IconColumns } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@meetzeen/ui/components/select";

const columnLabels: Record<string, string> = {
  name: "Nombre",
  email: "Email",
  phoneNumber: "Teléfono",
  totalAppointments: "Citas",
  lastAppointmentDate: "Última cita",
};

export function CustomersTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("recent");
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    name: true,
    email: true,
    phoneNumber: true,
    totalAppointments: true,
    lastAppointmentDate: true,
  });

  // Debounce para la búsqueda
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset a la primera página al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading, error, refetch } = useAllCustomers({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: debouncedSearch || undefined,
    sortBy: sortBy || undefined,
  });

  const customers = (data?.results as Customer[]) || [];
  const meta = data?.meta;

  const table = useReactTable({
    data: customers,
    columns: columns as ColumnDef<Customer>[],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta ? Math.ceil(meta.filteredCustomers / pagination.pageSize) : -1,
    state: {
      pagination,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y controles */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconColumns className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnId = column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      checked={column.getIsVisible()}
                      onCheckedChange={() => toggleColumn(columnId)}
                    >
                      {columnLabels[columnId] || columnId}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contenido condicional */}
      {isLoading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
            <p className="text-base font-medium">Buscando clientes</p>
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        </div>
      ) : error ? (
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-base font-medium text-destructive">Error al cargar clientes</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Ocurrió un error al cargar los clientes"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2"
            >
              <IconRefresh className="size-4" />
              Reintentar
            </Button>
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-base font-medium">No hay clientes</p>
              <p className="text-sm text-muted-foreground">
                {debouncedSearch
                  ? `No se encontraron clientes que coincidan con "${debouncedSearch}"`
                  : "Aún no tienes clientes registrados"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tabla con datos */}
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="border-b bg-muted/50"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {meta && meta.filteredCustomers > 0 && (
            <div className="flex items-center justify-between px-2 flex-wrap gap-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Mostrando {pagination.pageIndex * pagination.pageSize + 1} a{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  meta.filteredCustomers
                )}{" "}
                de {meta.filteredCustomers} clientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <IconChevronLeft className="size-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    Página {pagination.pageIndex + 1} de{" "}
                    {Math.max(1, Math.ceil(meta.filteredCustomers / pagination.pageSize))}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                  <IconChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
