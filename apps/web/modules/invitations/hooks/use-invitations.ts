import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationsService } from "@/modules/invitations/services/invitations-service";
import { useDashboardStore } from "@/modules/dashboard/store/dashboard-store";
import type { Invitation } from "@/modules/invitations/types/invitation.types";

export interface SendInvitationDto {
  email: string;
  role: string;
  organizationId?: string;
}

export const useVerifyInvitation = (token: string | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invitation", "verify", token],
    queryFn: () => {
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      return invitationsService.verifyToken(token);
    },
    enabled: !!token,
    retry: false,
  });

  return { data, isLoading, error, refetch };
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: acceptInvitation,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (token: string) => {
      if (!token) {
        throw new Error("Token es requerido");
      }
      return invitationsService.acceptInvitation(token);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas después de aceptar
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  return {
    acceptInvitation,
    isPending,
    error,
    isSuccess,
  };
};

export const useSendedInvitations = () => {
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const { data, isLoading, error, refetch } = useQuery<Invitation[]>({
    queryKey: ["invitations", "sended", organizationId],
    queryFn: () => {
      if (!organizationId) {
        throw new Error("Organization ID es requerido");
      }
      return invitationsService.getSendedInvitations(organizationId);
    },
    enabled: !!organizationId,
  });

  return { data, isLoading, error, refetch };
};

export const useSendInvitation = () => {
  const queryClient = useQueryClient();
  const organizationId = useDashboardStore((state) => state.organization?.id);

  const {
    mutate: sendInvitation,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: SendInvitationDto) => {
      const { email, role, organizationId: orgId } = data;

      if (!email || !email.trim()) {
        throw new Error("El email es requerido");
      }

      if (!role || !role.trim()) {
        throw new Error("El rol es requerido");
      }

      const finalOrgId = orgId || organizationId;
      if (!finalOrgId) {
        throw new Error("Organization ID es requerido");
      }

      return invitationsService.sendInvitation(
        email.trim(),
        role.trim(),
        finalOrgId
      );
    },
    onSuccess: () => {
      // Invalidar la lista de invitaciones enviadas
      queryClient.invalidateQueries({
        queryKey: ["invitations", "sended", organizationId],
      });
    },
  });

  return { sendInvitation, isPending, error, isSuccess };
};
