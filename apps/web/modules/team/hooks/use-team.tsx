import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { teamService } from "@/modules/team/services/team-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { 
  Team, 
  CreateTemplateParams, 
  UpdateWeeklyTemplateParams,
  SetDayAvailabilityParams,
  SetDaysOffParams,
  SetMultipleDaysAvailabilityParams,
  RemoveDayExceptionParams,
  UpdateScheduleParams,
  RemoveScheduleParams
} from "@/modules/team/types/team.types";

export const useTeam = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["team", organizationId],
    queryFn: () => teamService.getTeam(organizationId),
    enabled: !!organizationId,
  });

  return {
    data: data as Team[] | undefined,
    isLoading,
    error,
    refetch,
  };
};

export const useTeamCalendar = (memberId: string) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);
  const organizationTimezone = useDashboardStore((state) => state.organization?.timezone);

  const { startDate, endDate, timezone } = useMemo<{
    startDate: string;
    endDate: string;
    timezone: string;
  }>(() => {
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tz: string = organizationTimezone || clientTimezone || "UTC";

    // Obtener la fecha de hoy en la zona horaria correcta
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    
    const todayStr = formatter.format(new Date()); // Formato YYYY-MM-DD
    const parts = todayStr.split("-").map(Number);
    const year = parts[0] ?? new Date().getFullYear();
    const month = parts[1] ?? (new Date().getMonth() + 1);
    const day = parts[2] ?? new Date().getDate();
    const today = new Date(year, month - 1, day, 12, 0, 0);

    // Fecha de inicio: 3 días atrás
    const start = new Date(today);
    start.setDate(start.getDate() - 3);

    // Fecha de fin: 120 días adelante (aproximadamente 17 semanas de calendario)
    const end = new Date(today);
    end.setDate(end.getDate() + 120);

    const formatDate = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
      timezone: tz,
    };
  }, [organizationTimezone]);

  return useQuery({
    queryKey: ["team-calendar", memberId, startDate, endDate, organizationId, timezone],
    queryFn: () =>
      teamService.getCalendar(memberId, startDate, endDate, organizationId, timezone),
    enabled: !!memberId && !!startDate && !!endDate && !!organizationId,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateTemplateParams) => {
      const orgId = organizationId || useDashboardStore.getState().organization?.id;

      if (!orgId) {
        throw new Error("Organization ID is required");
      }

      return teamService.createTemplate(data.memberId, orgId, data.timeBlocks);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
    },
  });

  return {
    createTemplate,
    isCreating,
  };
};

export const useUpdateWeeklyTemplate = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: updateWeeklyTemplate, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateWeeklyTemplateParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.updateWeeklyTemplate(
        data.memberId,
        data.dayOfWeek,
        data.timeBlocks,
        organizationId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    updateWeeklyTemplate,
    isUpdating,
  };
};

export const useSetDayAvailability = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: setDayAvailability, isPending: isSettingDay } = useMutation({
    mutationFn: (data: SetDayAvailabilityParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.setDayAvailability(
        data.memberId,
        organizationId,
        data.date,
        data.timeBlocks,
        data.reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    setDayAvailability,
    isSettingDay,
  };
};

export const useSetDaysOff = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: setDaysOff, isPending: isSettingDaysOff } = useMutation({
    mutationFn: (data: SetDaysOffParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.setDaysOff(
        data.memberId,
        organizationId,
        data.startDate,
        data.endDate,
        data.reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    setDaysOff,
    isSettingDaysOff,
  };
};

export const useSetMultipleDaysAvailability = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: setMultipleDaysAvailability, isPending: isSettingMultipleDays } = useMutation({
    mutationFn: (data: SetMultipleDaysAvailabilityParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.setMultipleDaysAvailability(
        data.memberId,
        organizationId,
        data.dates,
        data.timeBlocks,
        data.reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    setMultipleDaysAvailability,
    isSettingMultipleDays,
  };
};

export const useRemoveDayException = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: removeDayException, isPending: isRemovingException } = useMutation({
    mutationFn: (data: RemoveDayExceptionParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.removeDayException(
        data.memberId,
        organizationId,
        data.date
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    removeDayException,
    isRemovingException,
  };
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: updateSchedule, isPending: isUpdatingSchedule } = useMutation({
    mutationFn: (data: UpdateScheduleParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.updateSchedule(
        data.memberId,
        organizationId,
        data.action,
        data.date,
        data.timeBlocks,
        data.repeatCount,
        data.reason
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    updateSchedule,
    isUpdatingSchedule,
  };
};

export const useRemoveSchedule = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { mutate: removeSchedule, isPending: isRemovingSchedule } = useMutation({
    mutationFn: (data: RemoveScheduleParams) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }

      return teamService.removeSchedule(
        data.memberId,
        organizationId,
        data.date
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team-calendar", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team", organizationId],
      });
    },
  });

  return {
    removeSchedule,
    isRemovingSchedule,
  };
};
