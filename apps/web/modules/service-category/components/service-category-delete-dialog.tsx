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
import { useServiceCategory } from "@/modules/service-category/hooks/use-service-category";
import { ServiceCategory } from "@/modules/service-category/types/service-category.types";
import { IconTrash } from "@tabler/icons-react";

export function ServiceCategoryDeleteDialog({
  serviceCategory,
}: {
  serviceCategory: ServiceCategory;
}) {
  const { deleteServiceCategory, isDeleting } = useServiceCategory();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" size="icon" className="h-8 w-8">
          <IconTrash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-geist">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar Categoría</AlertDialogTitle>
          <AlertDialogDescription>
            Estás seguro de querer eliminar la categoría {serviceCategory.name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteServiceCategory(serviceCategory.id)}
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
