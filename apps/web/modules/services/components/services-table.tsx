"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useAllServices } from "@/modules/services/hooks/use-service";
import { columns } from "./colums";
import { Service } from "@/modules/services/types/service.types";
import { ServicesSheet } from "@/modules/services/components/service-sheet";
import { Input } from "@meetzeen/ui/components/input";
import { IconSearch } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@meetzeen/ui/components/dropdown-menu";
import { Button } from "@meetzeen/ui/components/button";
import { IconColumns, IconRefresh } from "@tabler/icons-react";

const columnLabels: Record<string, string> = {
  name: "Nombre",
  description: "Descripción",
  price: "Precio",
  duration: "Duración",
  discount: "Descuento",
  createdAt: "Creado",
};

export function ServicesTable() {
  const { data, isLoading, error, refetch } = useAllServices();
  const [searchValue, setSearchValue] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    name: true,
    description: true,
    price: true,
    duration: true,
    discount: true,
    createdAt: true,
  });

  const table = useReactTable({
    data: (data as Service[]) || [],
    columns: columns as ColumnDef<Service>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const service = row.original;
      
      return (
        service.name.toLowerCase().includes(search) ||
        (service.description?.toLowerCase().includes(search) ?? false) ||
        service.price.toLowerCase().includes(search)
      );
    },
  });

  const services = (data as Service[]) || [];
  const filteredRows = table.getFilteredRowModel().rows;

  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Barra superior con búsqueda y botón */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar servicios..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
          <ServicesSheet variant="outline" />
        </div>
      </div>

      {/* Contenido condicional */}
      {isLoading ? (
        // Estado de carga
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
            <p className="text-base font-medium">Buscando servicios</p>
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        </div>
      ) : error ? (
        // Estado de error
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-base font-medium text-destructive">Error en los servicios</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Ocurrió un error al cargar los servicios"}
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
      ) : services.length === 0 ? (
        // Estado vacío
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-base font-medium">No hay servicios</p>
              <p className="text-sm text-muted-foreground">
                Comienza creando tu primer servicio
              </p>
            </div>
            <ServicesSheet variant="default" text="Crear Servicio" />
          </div>
        </div>
      ) : (
        // Tabla con datos
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
                {filteredRows.length === 0 ? (
                  // Sin resultados de búsqueda
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm font-medium">No se encontraron resultados</p>
                        <p className="text-xs">
                          No hay servicios que coincidan con &quot;{searchValue}&quot;
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Datos normales
                  filteredRows.map((row) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

