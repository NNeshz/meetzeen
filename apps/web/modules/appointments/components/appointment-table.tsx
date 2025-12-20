"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useAppointmentsHistory } from "@/modules/appointments/hooks/use-appointments";
import { columns } from "./columns";
import { RawAppointment } from "@/modules/appointments/types/appointments-types";
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
  customerName: "Cliente",
  appointmentDate: "Fecha",
  startTime: "Hora de inicio",
  endTime: "Hora de fin",
};

export function AppointmentTable() {
  const [searchValue, setSearchValue] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    customerName: true,
    appointmentDate: true,
    startTime: true,
    endTime: true,
  });

  // Debounce search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading, error, refetch } = useAppointmentsHistory(
    debouncedSearch || undefined
  );

  const appointments: RawAppointment[] = React.useMemo(() => {
    return data?.results?.appointments || [];
  }, [data]);

  const table = useReactTable({
    data: appointments,
    columns: columns as ColumnDef<RawAppointment>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
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
      {/* Barra superior con búsqueda y botón */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar citas..."
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
            <p className="text-base font-medium">Buscando citas</p>
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        </div>
      ) : error ? (
        // Estado de error
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-base font-medium text-destructive">Error al cargar las citas</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Ocurrió un error al cargar las citas"}
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
      ) : appointments.length === 0 ? (
        // Estado vacío
        <div className="py-32 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-base font-medium">No hay citas</p>
              <p className="text-sm text-muted-foreground">
                {searchValue
                  ? `No se encontraron citas que coincidan con "${searchValue}"`
                  : "No hay citas en el historial"}
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
                {table.getRowModel().rows.length === 0 ? (
                  // Sin resultados de búsqueda
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm font-medium">No se encontraron resultados</p>
                        <p className="text-xs">
                          No hay citas que coincidan con &quot;{searchValue}&quot;
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Datos normales
                  table.getRowModel().rows.map((row) => (
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

