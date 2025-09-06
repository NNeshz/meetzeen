import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriasService } from "@/modules/dashboard/categorias/service/categorias-service";
import { useCategoriesFilters } from "@/modules/dashboard/categorias/store/useCategoriesStore";
import { useDebounce } from "@/utils/use-debounce";
import { toast } from "sonner";

const categoriasService = new CategoriasService();

export const useCategoriasQuery = () => {
  const { currentPage, search } = useCategoriesFilters();

  const debouncedSearch = useDebounce(search, 750);

  const filters = {
    page: currentPage,
    ...(debouncedSearch &&
      debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["categorias", filters],
    queryFn: () => categoriasService.listCategorias(filters),
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

export const useCreateCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => categoriasService.createCategoria(name),
    onSuccess: () => {
      toast.success("Categoría creada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al crear la categoría");
    },
  });
};

export const useUpdateCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoriasService.updateCategoria(id, name),
    onSuccess: () => {
      toast.success("Categoría actualizada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar la categoría");
    },
  });
};

export const useDeleteCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriasService.deleteCategoria(id),
    onSuccess: () => {
      toast.success("Categoría eliminada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al eliminar la categoría");
    },
  });
};
