import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/modules/team/services/team-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { BaseSchedule, Team, UpdateMemberCalendar } from "@/modules/team/types/team.types";

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

export const useMemberCalendar = (userId: string | undefined) => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["member-calendar", userId, organizationId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      return teamService.getMemberCalendar(userId, organizationId);
    },
    enabled: !!userId && !!organizationId,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  });

  return {
    data: data as BaseSchedule[] | undefined,
    isLoading,
    error,
    isError,
    refetch,
    isEmpty: !isLoading && !error && (!data || data.length === 0),
  };
};

export const useUpdateMemberCalendar = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore(
    (state) => state.organization?.id
  );

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      organizationId: string;
      schedules: UpdateMemberCalendar[];
    }) => {
      if (!data.userId) {
        throw new Error("User ID is required");
      }
      if (!data.organizationId) {
        throw new Error("Organization ID is required");
      }
      return teamService.updateMemberCalendar(
        data.userId,
        data.organizationId,
        data.schedules
      );
    },
    onSuccess: () => {
      // Invalidar y refetch el calendario del miembro
      queryClient.invalidateQueries({
        queryKey: ["member-calendar", userId, organizationId],
      });
    },
  });
};
