import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { negocioService } from "@/modules/dashboard/settings/service/negocio-service";
import { toast } from "sonner";
import { CreateNegocioDTO } from "@/modules/dashboard/settings/types/create-negocio";
import { useRouter } from "next/navigation";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: CreateNegocioDTO) =>
      negocioService.createCompany(formData),
    onSuccess: () => {
      toast.success("Empresa creada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["company"] });
      // Invalidar también el progreso para que se actualice automáticamente
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al crear la empresa");
    },
  });
};

export const useCompanySettings = () => {
  return useQuery({
    queryKey: ["companySettings"],
    queryFn: () => negocioService.getSettings(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCompanyImage = () => {
  return useQuery({
    queryKey: ["companyImage"],
    queryFn: () => negocioService.getImage(),
    staleTime: 1000 * 60 * 5,
  });
};

// PATCH DE SETTINGS

export const useUpdateCompanyName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => negocioService.updateName(name),
    onSuccess: () => {
      toast.success("Nombre de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companySettings"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el nombre de la empresa");
    },
  });
};

export const useUpdateCompanyTimezone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timezone: string) => negocioService.updateTimezone(timezone),
    onSuccess: () => {
      toast.success("Timezone de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companySettings"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el timezone de la empresa");
    },
  });
};

export const useUpdateCompanyCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currency: string) => negocioService.updateCurrency(currency),
    onSuccess: () => {
      toast.success("Currency de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companySettings"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar la currency de la empresa");
    },
  });
};



