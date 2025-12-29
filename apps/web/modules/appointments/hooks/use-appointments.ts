import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "@/modules/appointments/service/appointments-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { Temporal } from "@js-temporal/polyfill";


function getDateRange(currentDate: Temporal.PlainDate) {
  // Inicio: primer día del mes anterior (para no perder citas al navegar)
  const startDate = currentDate.subtract({ months: 1 }).with({ day: 1 });
  
  // Fin: último día de 2 meses adelante (mes actual + 2 meses completos)
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
      return appointmentsService.getAppointments(organizationId, startDate, endDate);
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
