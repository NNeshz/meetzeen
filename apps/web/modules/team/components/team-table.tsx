"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTeam } from "@/modules/team/hooks/use-team";
import { columns } from "./colum";
import { Team } from "@/modules/team/types/team.types";
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
  name: "Miembro",
  role: "Rol",
  createdAt: "Fecha de ingreso",
  actions: "Acciones",
};

export function TeamTable() {
  const { data, isLoading, error, refetch } = useTeam();
  const [searchValue, setSearchValue] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({
    name: true,
    role: true,
    createdAt: true,
    actions: true,
  });

  const table = useReactTable({
    data: (data as Team[]) || [],
    columns: columns as ColumnDef<Team>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const team = row.original;

      return (
        team.name.toLowerCase().includes(search) ||
        team.email.toLowerCase().includes(search) ||
        team.role.toLowerCase().includes(search) ||
        team.createdAt.toLowerCase().includes(search)
      );
    },
  });

  const team = (data as Team[]) || [];
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
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar miembros..."
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
        </div>
      </div>

      {/* Contenido condicional */}
      {isLoading ? (
        // Estado de carga
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
            <p className="text-base font-medium">Buscando miembros</p>
            <p className="text-sm text-muted-foreground">
              Cargando información...
            </p>
          </div>
        </div>
      ) : error ? (
        // Estado de error
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-base font-medium text-destructive">
                Error en el equipo
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error
                  ? error.message
                  : "Ocurrió un error al cargar el equipo"}
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
      ) : team.length === 0 ? (
        // Estado vacío
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-base font-medium">No hay miembros</p>
              <p className="text-sm text-muted-foreground">
                El equipo está vacío
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Tabla con datos
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/50">
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
                        <p className="text-sm font-medium">
                          No se encontraron resultados
                        </p>
                        <p className="text-xs">
                          No hay miembros que coincidan con &quot;
                          {searchValue}&quot;
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
