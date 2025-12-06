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
import { Service } from "@/modules/services/types/service.types";
import { useService } from "@/modules/services/hooks/use-service";

export function ServiceDeleteDialog({ service }: { service: Service }) {
  const { deleteService, isDeleting } = useService();
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
          <AlertDialogTitle>Eliminar Servicio</AlertDialogTitle>
          <AlertDialogDescription>
            Estás seguro de querer eliminar el servicio {service.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteService(service.id)}
            disabled={isDeleting}
            className="bg-destructive text-white"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
