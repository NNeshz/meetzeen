import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EquipoService } from "@/modules/dashboard/equipo/service/equipo-service";
import { useEquipoFilters } from "@/modules/dashboard/equipo/store/useEquipoStore";
import { useDebounce } from "@/utils/use-debounce";
import { toast } from "sonner";

const equipoService = new EquipoService();

// Tipos para los empleados basados en la API
interface Employee {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  image?: string | File;
  categories: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EmployeesResponse {
  status: number;
  message: string;
  data: Employee[];
  count: number;
  filters: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEmployees: number;
    employeesPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export const useEquipoQuery = () => {
  const { currentPage, search, categoryId } = useEquipoFilters();

  const debouncedSearch = useDebounce(search, 750);

  const filters = {
    page: currentPage,
    ...(debouncedSearch &&
      debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
    ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["equipo", filters],
    queryFn: () => equipoService.listEmployees(filters),
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

// Mapea los días del formulario a índices 1-7
const DAY_KEY_TO_INDEX = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 7,
} as const;

type UISchedulesByDay = {
  lunes: Array<{ start: string; end: string }>;
  martes: Array<{ start: string; end: string }>;
  miercoles: Array<{ start: string; end: string }>;
  jueves: Array<{ start: string; end: string }>;
  viernes: Array<{ start: string; end: string }>;
  sabado: Array<{ start: string; end: string }>;
  domingo: Array<{ start: string; end: string }>;
};

function flattenSchedules(schedules: UISchedulesByDay) {
  const result: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
  
  
  (Object.keys(DAY_KEY_TO_INDEX) as Array<keyof typeof DAY_KEY_TO_INDEX>).forEach((key) => {
    const dayIndex = DAY_KEY_TO_INDEX[key];
    
    schedules[key].forEach((t) => {
      const entry = {
        dayOfWeek: dayIndex,
        startTime: t.start,
        endTime: t.end,
      };
      result.push(entry);
    });
  });
  
  return result;
}

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useEquipoFilters();

  return useMutation({
    mutationFn: (employeeData: {
      name: string;
      phoneNumber: string;
      email: string;
      image?: File;
      categoryIds: string[]; // array en el hook
      schedules: UISchedulesByDay; // estructura del formulario
    }) => {
      const dataToSend = {
        ...employeeData,
        categoryIds: employeeData.categoryIds.join(","),
        schedules: flattenSchedules(employeeData.schedules),
      };
      return equipoService.createEmployee(dataToSend);
    },
    
    // Optimistic Update
    onMutate: async (employeeData) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && {
          categoryId: categoryId.trim(),
        }),
      };

      const queryKey = ["equipo", filters];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<EmployeesResponse>(queryKey);

      const tempEmployee: Employee = {
        id: `temp-${Date.now()}`,
        name: employeeData.name,
        phoneNumber: employeeData.phoneNumber,
        email: employeeData.email,
        image: undefined,
        categories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (previousData) {
        queryClient.setQueryData<EmployeesResponse>(queryKey, {
          ...previousData,
          data: [tempEmployee, ...previousData.data],
          count: previousData.count + 1,
          pagination: {
            ...previousData.pagination,
            totalEmployees: previousData.pagination.totalEmployees + 1,
          },
        });
      }

      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Empleado creado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["equipo"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al crear el empleado");
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useEquipoFilters();

  return useMutation({
    mutationFn: ({ id, employeeData }: { 
      id: string; 
      employeeData: {
        name?: string;
        phoneNumber?: string;
        email?: string;
        image?: File | string | undefined;
        categoryIds?: string[]; // Mantener como array
        hasImageChanged?: boolean;
      }
    }) => {
      // Convertir array a string si existe
      const dataToSend = {
        ...employeeData,
        categoryIds: employeeData.categoryIds ? employeeData.categoryIds.join(',') : undefined,
      };
      return equipoService.updateEmployee(id, dataToSend);
    },
    
    // Optimistic Update
    onMutate: async ({ id, employeeData }) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
      };
      
      const queryKey = ["equipo", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<EmployeesResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<EmployeesResponse>(queryKey, {
          ...previousData,
          data: previousData.data.map((employee) =>
            employee.id === id
              ? { 
                  ...employee, 
                  ...employeeData,
                  updatedAt: new Date().toISOString() 
                }
              : employee
          ),
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Empleado actualizado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["equipo"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al actualizar el empleado");
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const { currentPage, search, categoryId } = useEquipoFilters();

  return useMutation({
    mutationFn: (id: string) => equipoService.deleteEmployee(id),
    
    // Optimistic Update
    onMutate: async (id: string) => {
      const debouncedSearch = search;
      const filters = {
        page: currentPage,
        ...(debouncedSearch &&
          debouncedSearch.trim() !== "" && { search: debouncedSearch.trim() }),
        ...(categoryId && categoryId.trim() !== "" && { categoryId: categoryId.trim() }),
      };
      
      const queryKey = ["equipo", filters];
      
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey });
      
      // Obtener datos previos
      const previousData = queryClient.getQueryData<EmployeesResponse>(queryKey);
      
      // Actualizar cache optimísticamente
      if (previousData) {
        queryClient.setQueryData<EmployeesResponse>(queryKey, {
          ...previousData,
          data: previousData.data.filter((employee) => employee.id !== id),
          count: previousData.count - 1,
          pagination: {
            ...previousData.pagination,
            totalEmployees: previousData.pagination.totalEmployees - 1,
          },
        });
      }
      
      return { previousData, queryKey };
    },
    
    onSuccess: () => {
      toast.success("Empleado eliminado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["equipo"] });
    },
    
    onError: (error: Error, variables, context) => {
      // Revertir cambios en caso de error
      if (context?.previousData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      toast.error(error?.message || "Error al eliminar el empleado");
    },
  });
};

export const useUpdateEmployeeScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, schedules }: { 
      id: string; 
      schedules: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
      }>
    }) => equipoService.updateEmployeeSchedule(id, schedules),
    
    onSuccess: () => {
      toast.success("Horario del empleado actualizado con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["equipo"] });
    },
    
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el horario del empleado");
    },
  });
};

export const useEmployeeAvailabilityQuery = (
  id: string,
  options?: { months?: number; startDate?: string; endDate?: string; enabled?: boolean }
) => {
  const months = options?.months ?? 6;
  const startDate = options?.startDate;
  const endDate = options?.endDate;
  const enabled = options?.enabled ?? true;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employee-availability", id, months, startDate, endDate],
    queryFn: () => equipoService.getEmployeeAvailability(id, { months, startDate, endDate }),
    enabled: Boolean(id) && enabled,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};