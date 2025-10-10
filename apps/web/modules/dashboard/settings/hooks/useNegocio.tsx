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


