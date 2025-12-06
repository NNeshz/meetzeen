import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/modules/company/services/company-service";
import type { CreateCompanyDto } from "@/modules/company/types/company.types";

export const useAllCompanies = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAllCompanies(),
  });

  return { data, isLoading, error };
};

export const useCompany = () => {
  const queryClient = useQueryClient();

  const { mutate: createCompany, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateCompanyDto) =>
      companyService.createCompany(data.name, data.timezone, data.currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    createCompany,
    isCreating,
  };
};
