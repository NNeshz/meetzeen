import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@meetzeen/ui/src/components/sheet"
import { Button } from "@meetzeen/ui/src/components/button"
import { Input } from "@meetzeen/ui/src/components/input"
import { IconAdjustments, IconPlus, IconSearch } from "@tabler/icons-react"

export function EquipoFilter() {
    return (
        <div className="flex items-center justify-between">
            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <IconSearch className="text-muted-foreground h-5 w-5" />
                </span>
                <Input placeholder="Buscar" className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <IconAdjustments className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-xl">
                        <SheetHeader>
                            <SheetTitle>Filtrar</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <IconPlus className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-xl">
                        <SheetHeader>
                            <SheetTitle>Agregar miembro</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}