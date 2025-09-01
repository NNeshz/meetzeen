import { formatShortDate } from "@/utils/format-date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@meetzeen/ui/components/table"
import { Button } from "@meetzeen/ui/src/components/button"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "@meetzeen/ui/src/components/dropdown-menu"
import { IconDots } from "@tabler/icons-react"
import Link from "next/link"

const data = [
  {
    name: "Cabello",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "Activo",
  },
]

export function CategoriasTable() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted/30 border-b border-border/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Nombre</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Creado</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Actualizado</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Estado</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6 text-end">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
              <TableCell className="py-4 px-6 font-medium">{item.name}</TableCell>
              <TableCell className="py-4 px-6 text-muted-foreground">{formatShortDate(item.createdAt)}</TableCell>
              <TableCell className="py-4 px-6 text-muted-foreground">{formatShortDate(item.updatedAt)}</TableCell>
              <TableCell className="py-4 px-6">
                <span className="inline-flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="py-4 px-6 text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                      <span className="sr-only">Open menu</span>
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                      <Link href={`/categorias/${item.name}`}>Ver</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/categorias/${item.name}/edit`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Link href={`/categorias/${item.name}/delete`}>Eliminar</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
