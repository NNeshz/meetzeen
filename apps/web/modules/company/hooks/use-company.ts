import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/modules/company/services/company-service";
import type { CreateCompanyDto } from "@/modules/company/types/company.types";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";

export const useAllCompanies = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAllCompanies(),
  });

  return { data, isLoading, error };
};

export const useCompany = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);
  const queryClient = useQueryClient();

  const {
    data: companyData,
    isLoading: isGettingCompany,
    error: errorGettingCompany,
  } = useQuery({
    queryKey: ["company", organizationId],
    queryFn: () => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return companyService.getCompany(organizationId);
    },
    enabled: !!organizationId,
  });

  const invalidateCompanyQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["company", organizationId] });
    queryClient.invalidateQueries({ queryKey: ["companies"] });
  };

  const { mutate: createCompany, isPending: isCreatingCompany } = useMutation({
    mutationFn: (data: CreateCompanyDto) =>
      companyService.createCompany(data.name, data.timezone, data.currency),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const { mutate: uploadLogo, mutateAsync: uploadLogoAsync, isPending: isUploadingLogo } = useMutation({
    mutationFn: (file: File) =>
      companyService.uploadLogo(file, organizationId || ""),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const { mutate: updateCompanyName, isPending: isUpdatingCompanyName } =
    useMutation({
      mutationFn: (name: string) =>
        companyService.updateCompanyName(name, organizationId || ""),
      onSuccess: () => {
        invalidateCompanyQueries();
      },
    });

  const { mutate: updateCompanySlug, isPending: isUpdatingCompanySlug } =
    useMutation({
      mutationFn: (slug: string) =>
        companyService.updateCompanySlug(slug, organizationId || ""),
      onSuccess: () => {
        invalidateCompanyQueries();
      },
    });

  const {
    mutate: updateCompanyTimezone,
    isPending: isUpdatingCompanyTimezone,
  } = useMutation({
    mutationFn: (timezone: string) =>
      companyService.updateCompanyTimezone(timezone, organizationId || ""),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const {
    mutate: updateCompanyCurrency,
    isPending: isUpdatingCompanyCurrency,
  } = useMutation({
    mutationFn: (currency: string) =>
      companyService.updateCompanyCurrency(currency, organizationId || ""),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const {
    mutate: updateCompanyWorkdays,
    isPending: isUpdatingCompanyWorkdays,
  } = useMutation({
    mutationFn: (workdays: number[]) =>
      companyService.updateCompanyWorkdays(workdays, organizationId || ""),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const { mutate: updateStartHour, isPending: isUpdatingStartHour } =
    useMutation({
      mutationFn: ({
        startHour,
        startMinute,
      }: {
        startHour: number;
        startMinute: number;
      }) =>
        companyService.updateStartHour(
          startHour,
          startMinute,
          organizationId || ""
        ),
      onSuccess: () => {
        invalidateCompanyQueries();
      },
    });

  const { mutate: updateEndHour, isPending: isUpdatingEndHour } = useMutation({
    mutationFn: ({
      endHour,
      endMinute,
    }: {
      endHour: number;
      endMinute: number;
    }) =>
      companyService.updateEndHour(endHour, endMinute, organizationId || ""),
    onSuccess: () => {
      invalidateCompanyQueries();
    },
  });

  const { mutate: updateLocation, isPending: isUpdatingLocation } = useMutation(
    {
      mutationFn: (location: string) =>
        companyService.updateLocation(location, organizationId || ""),
      onSuccess: () => {
        invalidateCompanyQueries();
      },
    }
  );

  const { mutate: updateSocialLinks, isPending: isUpdatingSocialLinks } =
    useMutation({
      mutationFn: (socialLinks: {
        facebookLink?: string;
        instagramLink?: string;
        whatsappLink?: string;
        tiktokLink?: string;
      }) => companyService.updateSocialLinks(socialLinks, organizationId || ""),
      onSuccess: () => {
        invalidateCompanyQueries();
      },
    });

  return {
    // Query data
    companyData,
    isGettingCompany,
    errorGettingCompany,
    // Mutations
    createCompany,
    updateCompanyName,
    updateCompanySlug,
    updateCompanyTimezone,
    updateCompanyCurrency,
    updateCompanyWorkdays,
    updateStartHour,
    updateEndHour,
    updateLocation,
    updateSocialLinks,
    uploadLogo,
    uploadLogoAsync,
    // Loading states
    isUploadingLogo,
    isUpdatingCompanyWorkdays,
    isUpdatingStartHour,
    isUpdatingEndHour,
    isUpdatingLocation,
    isUpdatingSocialLinks,
    isCreatingCompany,
    isUpdatingCompanyName,
    isUpdatingCompanySlug,
    isUpdatingCompanyTimezone,
    isUpdatingCompanyCurrency,
  };
};
