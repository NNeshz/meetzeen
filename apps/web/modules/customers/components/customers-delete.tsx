"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@meetzeen/ui/src/components/alert-dialog";
import { Button } from "@meetzeen/ui/src/components/button";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { useDeleteCustomer } from "@/modules/customers/hooks/use-customers";

export function CustomersDelete({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email: string;
}) {
  const { deleteCustomer, isDeleting } = useDeleteCustomer();

  const handleDelete = () => {
    deleteCustomer(id, {
      onSuccess: () => {
        toast.success("Cliente eliminado exitosamente");
      },
      onError: (error) => {
        toast.error("Error al eliminar el cliente", {
          description:
            error instanceof Error ? error.message : "Intenta de nuevo",
        });
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="w-full justify-start"
        >
          <IconTrash className="size-4 mr-2" />
          <span>Eliminar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-geist">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de querer eliminar el cliente {name} ({email})? Esta
            acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
