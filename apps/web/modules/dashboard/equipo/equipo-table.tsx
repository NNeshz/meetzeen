import { formatShortDate } from "@/utils/format-date"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@meetzeen/ui/components/table"
import { Badge } from "@meetzeen/ui/src/components/badge"
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
    name: "Jacob Sánchez",
    categories: ["Cabello", "Corte", "Barba"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Maria Rodriguez",
    categories: ["Cabello", "Corte", "Barba"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Juan Perez",
    categories: ["Cabello", "Corte", "Barba"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Ana Martinez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Pedro Ramirez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzalez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzalezz",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzalezzz",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzaleez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzaleeez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzaalez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
  {
    name: "Luisa Gonzaaalez",
    categories: ["Cabello", "Corte", "Barba", "Uñas"],
    phone: "123-456-7890",
    status: "Activo",
    createdAt: new Date(),
  },
]

export function EquipoTable() {
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted/30 border-b border-border/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Nombre</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Creado</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6 min-w-[130px] max-w-[150px]">Categorías</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Teléfono</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6">Estado</TableHead>
            <TableHead className="text-muted-foreground font-medium py-4 px-6 text-end">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
              <TableCell className="py-4 px-6 font-medium">{item.name}</TableCell>
              <TableCell className="py-4 px-6 text-muted-foreground">{formatShortDate(item.createdAt)}</TableCell>
              <TableCell className="py-4 px-6 min-w-[130px] max-w-[150px]">
                <div className="flex flex-wrap gap-1">
                  {item.categories.map((category, idx) => (
                    <Badge key={idx} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 text-muted-foreground">{item.phone}</TableCell>
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
                      <Link href={`/equipo/${item.name}`}>Ver</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/equipo/${item.name}/edit`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Link href={`/equipo/${item.name}/delete`}>Eliminar</Link>
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
