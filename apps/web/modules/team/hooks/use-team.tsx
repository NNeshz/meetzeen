import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/modules/team/services/team-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import { Team } from "@/modules/team/types/team.types";

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
