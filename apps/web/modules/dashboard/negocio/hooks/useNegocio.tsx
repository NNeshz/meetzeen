import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { negocioService } from "@/modules/dashboard/negocio/service/negocio-service";
import { toast } from "sonner";

export const useCompany = () => {
  return useQuery({
    queryKey: ["company"],
    queryFn: () => negocioService.getMyCompany(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => negocioService.createCompany(formData),
    onSuccess: () => {
      toast.success("Empresa creada con éxito 🚀");
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al crear la empresa");
    },
  });
};
