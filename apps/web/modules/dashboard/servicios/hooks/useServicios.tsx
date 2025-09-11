import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/utils/use-debounce";
import { serviciosService } from "@/modules/dashboard/servicios/service/servicios-service";
import { useServiciosFilters } from "@/modules/dashboard/servicios/store/useServiciosStore";

// Tipos para los servicios basados en la API
interface Servicio {
  id: string;
  name: string;
  duration: string;
  price: number;
  categoryId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

interface ServiciosResponse {
  status: number;
  message: string;
  data: Servicio[];
  count: number;
  filters: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalServices: number;
    servicesPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export const useServiciosQuery = () => {
  const { currentPage, search, categoryId } = useServiciosFilters();

  const debouncedSearch = useDebounce(search, 750);

  const filters = {
    page: currentPage,
    ...(debouncedSearch &&
      debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
    ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["servicios", filters],
    queryFn: () => serviciosService.listServicios(filters),
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

export const useServicioByIdQuery = (id: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["servicio", id],
    queryFn: () => serviciosService.getServicioById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

export const useCreateServicioMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useServiciosFilters();

  return useMutation({
    mutationFn: ({ name, duration, price, categoryId }: { name: string; duration: string; price: number; categoryId: string }) =>
      serviciosService.createServicio(name, duration, price, categoryId),
    
    // Optimistic Update
    onMutate: async ({ name, duration, price, categoryId: newCategoryId }) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
      };
      
      const queryKey = ["servicios", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<ServiciosResponse>(queryKey);
      
      // Crear servicio temporal
      const tempServicio: Servicio = {
        id: `temp-${Date.now()}`,
        name,
        duration,
        price,
        categoryId: newCategoryId,
        organizationId: "temp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: {
          id: newCategoryId,
          name: "Categoría",
        },
      };
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<ServiciosResponse>(queryKey, {
          ...previousData,
          data: [tempServicio, ...previousData.data],
          count: previousData.count + 1,
          pagination: {
            ...previousData.pagination,
            totalServices: previousData.pagination.totalServices + 1,
          },
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Servicio creado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al crear el servicio");
    },
  });
};

export const useUpdateServicioMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useServiciosFilters();

  return useMutation({
    mutationFn: ({ id, name, duration, price, categoryId }: { id: string; name: string; duration: string; price: number; categoryId: string }) =>
      serviciosService.updateServicio(id, name, duration, price, categoryId),
    
    // Optimistic Update
    onMutate: async ({ id, name, duration, price, categoryId: newCategoryId }) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
      };
      
      const queryKey = ["servicios", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<ServiciosResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<ServiciosResponse>(queryKey, {
          ...previousData,
          data: previousData.data.map((servicio) =>
            servicio.id === id
              ? { ...servicio, name, duration, price, categoryId: newCategoryId, updatedAt: new Date().toISOString() }
              : servicio
          ),
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Servicio actualizado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al actualizar el servicio");
    },
  });
};

export const useDeleteServicioMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useServiciosFilters();

  return useMutation({
    mutationFn: (id: string) => serviciosService.deleteServicio(id),
    
    // Optimistic Update
    onMutate: async (id: string) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
      };
      
      const queryKey = ["servicios", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<ServiciosResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<ServiciosResponse>(queryKey, {
          ...previousData,
          data: previousData.data.filter((servicio) => servicio.id !== id),
          count: previousData.count - 1,
          pagination: {
            ...previousData.pagination,
            totalServices: previousData.pagination.totalServices - 1,
          },
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Servicio eliminado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al eliminar el servicio");
    },
  });
};