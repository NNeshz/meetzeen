"use client";

import { formatShortDate } from "@/utils/format-date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@meetzeen/ui/components/table";
import { Badge } from "@meetzeen/ui/src/components/badge";
import { Button } from "@meetzeen/ui/src/components/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from "@meetzeen/ui/src/components/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@meetzeen/ui/src/components/avatar";
import { IconDots, IconUser } from "@tabler/icons-react";

import { Loading } from "@/modules/dashboard/components/loading";
import { Error } from "@/modules/dashboard/components/error";
import { Empty } from "@/modules/dashboard/components/empty";

import { useEquipoQuery } from "@/modules/dashboard/equipo/hooks/useEquipo";
import { EquipoSheetUpdate } from "@/modules/dashboard/equipo/components/equipo-sheet-update";
import { EquipoDelete } from "@/modules/dashboard/equipo/components/equipo-delete";
import { useEffect } from "react";
import { useEquipoFilters } from "@/modules/dashboard/equipo/store/useEquipoStore";

export function EquipoTable() {
  const { data, isLoading, isError } = useEquipoQuery();
  const { setPagination } = useEquipoFilters();

  useEffect(() => {
    if (data?.pagination) {
      const { currentPage, totalPages } = data.pagination;
      setPagination(currentPage, totalPages);
    }
  }, [data?.pagination, setPagination]);

  const employees = data?.data || [];

  if (isLoading) {
    return (
      <Loading
        message={["Cargando equipo...", "Mucha calidad, comprimiendola..."]}
      />
    );
  }

  if (isError) {
    return <Error message={"Error al cargar el equipo"} />;
  }

  if (employees.length === 0) {
    return <Empty message={"No se encontró ningun miebro"} />;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted/30 border-b border-border/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-muted-foreground font-medium py-4 px-6 w-16">
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">
              Nombre
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">
              Creado
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6 min-w-[130px] max-w-[150px]">
              Categorías
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">
              Teléfono
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">
              Correo
            </TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6 text-end">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <TableCell className="py-4 px-6">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={item.imageUrl || ""}
                      alt={`Avatar de ${item.name}`}
                    />
                    <AvatarFallback
                      className={`bg-brand text-brand-foreground`}
                    >
                      <IconUser className="h-5 w-5 text-black" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-4 px-6 font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="py-4 px-6 text-muted-foreground">
                  {formatShortDate(item.createdAt)}
                </TableCell>
                <TableCell className="py-4 px-6 min-w-[130px] max-w-[150px]">
                  <div className="flex flex-wrap gap-1">
                    {item.categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-muted-foreground">
                  {item.phoneNumber}
                </TableCell>
                <TableCell className="py-4 px-6 text-muted-foreground">
                  {item.email}
                </TableCell>
                <TableCell className="py-4 px-6 text-end">
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
                      <EquipoSheetUpdate employee={item} />
                      <EquipoDelete id={item.id} name={item.name} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
