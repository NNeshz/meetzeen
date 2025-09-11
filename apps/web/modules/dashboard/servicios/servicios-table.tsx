"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@meetzeen/ui/src/components/table";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconDots, IconMoodShare, IconTrash } from "@tabler/icons-react";
import { useServiciosQuery } from "@/modules/dashboard/servicios/hooks/useServicios";
import { useServiciosFilters } from "@/modules/dashboard/servicios/store/useServiciosStore";
import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";
import { Empty } from "@/modules/dashboard/components/empty";
import { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@meetzeen/ui/src/components/dropdown-menu";
import { ServicioSheetUpdate } from "@/modules/dashboard/servicios/components/servicios-sheet-update";
import { ServicioDelete } from "./components/servicios-delete";

export function ServiciosTable() {
  const { search, setPagination } = useServiciosFilters();
  const {
    data: serviciosData,
    isLoading,
    isError,
    refetch,
  } = useServiciosQuery();

  useEffect(() => {
    if (serviciosData?.pagination) {
      const { currentPage, totalPages } = serviciosData.pagination;
      setPagination(currentPage, totalPages);
    }
  }, [serviciosData?.pagination, setPagination]);

  if (isLoading) {
    return (
      <Loading
        message={[
          "Cargando servicios...",
          "Obteniendo información actualizada...",
          "Casi listo...",
        ]}
      />
    );
  }

  // Estado de error
  if (isError) {
    return (
      <Error
        message={[
          "Error al cargar los servicios",
          "No se pudo conectar con el servidor",
          "Verifica tu conexión a internet",
        ]}
        retry={refetch}
      />
    );
  }

  // Estado vacío
  if (!serviciosData?.data || serviciosData.data.length === 0) {
    return (
      <Empty
        message={[
          search
            ? `No se encontraron servicios para "${search}"`
            : "No hay servicios registrados",
          search
            ? "Intenta con otros términos de búsqueda"
            : "Comienza creando tu primer servicio",
          "Los servicios te ayudan a organizar tu negocio",
        ]}
      />
    );
  }

  const servicios = serviciosData.data;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-medium">{servicio.name}</TableCell>
              <TableCell>
                <Badge variant={"outline"}>
                  {servicio.category?.name || "Sin categoría"}
                </Badge>
              </TableCell>
              <TableCell>{servicio.duration} min</TableCell>
              <TableCell>${servicio.price}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-muted/50"
                      >
                        <span className="sr-only">Open menu</span>
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" >
                      <ServicioSheetUpdate
                        id={servicio.id}
                        name={servicio.name}
                        duration={servicio.duration}
                        price={servicio.price}
                        categoryId={servicio.categoryId}
                      />
                      <ServicioDelete
                        id={servicio.id}
                        name={servicio.name}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
