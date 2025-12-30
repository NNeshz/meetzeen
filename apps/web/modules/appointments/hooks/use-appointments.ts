import { useMutation, useQuery } from "@tanstack/react-query";
import { appointmentsService } from "@/modules/appointments/service/appointments-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { Temporal } from "@js-temporal/polyfill";

function getDateRange(currentDate: Temporal.PlainDate) {
  const startDate = currentDate.subtract({ months: 1 }).with({ day: 1 });

  const endMonth = currentDate.add({ months: 3 }).with({ day: 1 });
  const endDate = endMonth.subtract({ days: 1 });

  return {
    startDate: startDate.toString(),
    endDate: endDate.toString(),
  };
}

export const useAppointments = (currentDate?: Temporal.PlainDate) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const dateForRange = currentDate ?? Temporal.Now.plainDateISO();
  const { startDate, endDate } = getDateRange(dateForRange);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", organizationId, startDate, endDate],
    queryFn: () => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return appointmentsService.getAppointments(
        organizationId,
        startDate,
        endDate
      );
    },
    enabled: !!organizationId,
  });

  return { data, isLoading, error, refetch };
};

export const useAppointmentById = (id: string) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentsService.getAppointmentById(id),
    enabled: !!organizationId && !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useAppointmentsHistory = (search?: string) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const clientTimezone = Temporal.Now.timeZoneId();
  const clientCurrentTime = Temporal.Now.instant().toString();

  return useQuery({
    queryKey: ["appointments-history", organizationId, search],
    queryFn: () =>
      appointmentsService.getAppointmentsHistory(
        clientTimezone,
        clientCurrentTime,
        organizationId,
        search
      ),
    enabled: !!organizationId,
  });
};

import { useQueryClient, UseMutationOptions } from "@tanstack/react-query";

export const useChangeAppointmentStatus = (
  options?: UseMutationOptions<any, unknown, { id: string; status: string }>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentsService.changeAppointmentStatus(id, status),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["appointment"] }),
        queryClient.invalidateQueries({ queryKey: ["appointments-history"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
      ]);
      onSuccess?.(...args);
    },
    onError,
    ...restOptions,
  });
};

export const useChangePaymentStatus = (
  options?: UseMutationOptions<any, unknown, { id: string; status: string }>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentsService.changePaymentStatus(id, status),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["appointment"] }),
        queryClient.invalidateQueries({ queryKey: ["appointments-history"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
      ]);
      onSuccess?.(...args);
    },
    onError,
    ...restOptions,
  });
};

export const useChangePaymentMethod = (
  options?: UseMutationOptions<any, unknown, { id: string; method: string }>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restOptions } = options || {};
  return useMutation({
    mutationFn: ({ id, method }: { id: string; method: string }) =>
      appointmentsService.changePaymentMethod(id, method),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["appointment"] }),
        queryClient.invalidateQueries({ queryKey: ["appointments-history"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
      ]);
      onSuccess?.(...args);
    },
    onError,
    ...restOptions,
  });
};
