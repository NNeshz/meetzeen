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

export const useCompanyContact = () => {
  return useQuery({
    queryKey: ["companyContact"],
    queryFn: () => negocioService.getContact(),
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

// PATCH DE IMAGE

export const useUpdateCompanyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: File) => negocioService.updateImage(imageUrl),
    onSuccess: () => {
      toast.success("Imagen de la empresa actualizada con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyImage"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar la imagen de la empresa");
    },
  });
};

export const useUpdateCompanySlogan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slogan: string) => negocioService.updateSlogan(slogan),
    onSuccess: () => {
      toast.success("Slogan de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyImage"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el slogan de la empresa");
    },
  });
};

export const useUpdateCompanySlug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => negocioService.updateSlug(slug),
    onSuccess: () => {
      toast.success("Slug de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyImage"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el slug de la empresa");
    },
  });
};

export const useValidateCompanySlug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => negocioService.validateOrganizationSlug(slug),
    onSuccess: () => {
      toast.success("Slug de la empresa válido.");
      queryClient.invalidateQueries({ queryKey: ["companyImage"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al validar el slug de la empresa");
    },
  });
};

// PATCH DE CONTACT
export const useUpdateCompanyPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneNumber: string) => negocioService.updatePhoneNumber(phoneNumber),
    onSuccess: () => {
      toast.success("Teléfono de la empresa actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyContact"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el teléfono de la empresa");
    },
  });
};

export const useUpdateCompanyAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: string) => negocioService.updateAddress(address),
    onSuccess: () => {
      toast.success("Dirección de la empresa actualizada con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyContact"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar la dirección de la empresa");
    },
  });
};

export const useUpdateCompanyStart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { startHour: number; startMinute: number; startAmPm: string }) =>
      negocioService.updateStart(data),
    onSuccess: () => {
      toast.success("Horario de inicio actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyContact"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el horario de inicio");
    },
  });
};

export const useUpdateCompanyEnd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { endHour: number; endMinute: number; endAmPm: string }) =>
      negocioService.updateEnd(data),
    onSuccess: () => {
      toast.success("Horario de cierre actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyContact"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar el horario de cierre");
    },
  });
};

export const useUpdateCompanyWorkdays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workdays: number[]) => negocioService.updateWorkdays(workdays),
    onSuccess: () => {
      toast.success("Días de trabajo actualizados con éxito.");
      queryClient.invalidateQueries({ queryKey: ["companyContact"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Error al actualizar los días de trabajo");
    },
  });
}