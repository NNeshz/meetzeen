import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "@/modules/appointments/service/appointments-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { Temporal } from "@js-temporal/polyfill";

export const useAppointments = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", organizationId],
    queryFn: () => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const clientDate = Temporal.Now.plainDateISO().toString(); // Formato YYYY-MM-DD
      return appointmentsService.getAppointments(organizationId, clientDate);
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
  // Usar instant() para obtener un ISO string completo que el backend pueda convertir a Date
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
