import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriasService } from "@/modules/dashboard/categorias/service/categorias-service";
import { useCategoriesFilters } from "@/modules/dashboard/categorias/store/useCategoriesStore";
import { useDebounce } from "@/utils/use-debounce";
import { toast } from "sonner";

const categoriasService = new CategoriasService();

interface Categoria {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriasResponse {
  status: number;
  message: string;
  data: Categoria[];
  count: number;
  filters: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    categoriesPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

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
  const { currentPage, search } = useCategoriesFilters();

  return useMutation({
    mutationFn: (name: string) => categoriasService.createCategoria(name),
    
    // Optimistic Update
    onMutate: async (name: string) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
      };
      
      const queryKey = ["categorias", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<CategoriasResponse>(queryKey);
      
      // Crear categoría temporal
      const tempCategoria: Categoria = {
        id: `temp-${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<CategoriasResponse>(queryKey, {
          ...previousData,
          data: [tempCategoria, ...previousData.data],
          count: previousData.count + 1,
          pagination: {
            ...previousData.pagination,
            totalCategories: previousData.pagination.totalCategories + 1,
          },
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Categoría creada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      // Invalidar también el progreso para que se actualice automáticamente
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al crear la categoría");
    },
  });
};

export const useUpdateCategoriaMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search } = useCategoriesFilters();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoriasService.updateCategoria(id, name),
    
    // Optimistic Update
    onMutate: async ({ id, name }) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
      };
      
      const queryKey = ["categorias", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<CategoriasResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<CategoriasResponse>(queryKey, {
          ...previousData,
          data: previousData.data.map((categoria) =>
            categoria.id === id
              ? { ...categoria, name, updatedAt: new Date().toISOString() }
              : categoria
          ),
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Categoría actualizada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al actualizar la categoría");
    },
  });
};

export const useDeleteCategoriaMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search } = useCategoriesFilters();

  return useMutation({
    mutationFn: (id: string) => categoriasService.deleteCategoria(id),
    
    // Optimistic Update
    onMutate: async (id: string) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
      };
      
      const queryKey = ["categorias", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<CategoriasResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<CategoriasResponse>(queryKey, {
          ...previousData,
          data: previousData.data.filter((categoria) => categoria.id !== id),
          count: previousData.count - 1,
          pagination: {
            ...previousData.pagination,
            totalCategories: previousData.pagination.totalCategories - 1,
          },
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Categoría eliminada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al eliminar la categoría");
    },
  });
};
