import {
  IconTag,
  IconDots,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@meetzeen/ui/src/components/dropdown-menu";
import { formatShortDate } from "@/utils/format-date";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import { Button } from "@meetzeen/ui/src/components/button";
import { CategoriaSheetUpdate } from "@/modules/dashboard/categorias/components/categoria-sheet-update";
import { CategoriaDelete } from "@/modules/dashboard/categorias/components/categoria-delete";

interface Categoria {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function CategoriasCard({ categoria }: { categoria: Categoria }) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconTag className="size-5 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-medium text-foreground leading-tight">
                {categoria.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-muted-foreground">Activo</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label="Opciones de categoría"
              >
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <CategoriaSheetUpdate id={categoria.id} name={categoria.name} />
              <CategoriaDelete id={categoria.id} name={categoria.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4" />
            <span>Creado {formatShortDate(categoria.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconClock className="size-4" />
            <span>Actualizado {formatShortDate(categoria.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
