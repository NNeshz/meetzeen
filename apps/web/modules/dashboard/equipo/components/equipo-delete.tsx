"use client"

import { IconTrash } from "@tabler/icons-react"
import { useDeleteEmployeeMutation } from "@/modules/dashboard/equipo/hooks/useEquipo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@meetzeen/ui/src/components/alert-dialog"
import { DropdownMenuItem } from "@meetzeen/ui/src/components/dropdown-menu"

export function EquipoDelete({ id, name }: { id: string; name: string }) {
  const deleteMutation = useDeleteEmployeeMutation()

  const handleDelete = () => {
    deleteMutation.mutate(id)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <IconTrash className="size-4" />
          <span>Eliminar</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el empleado "{name}" y todos los datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}