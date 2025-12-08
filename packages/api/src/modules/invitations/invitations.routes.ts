import Elysia, { t } from "elysia";
import { invitationsModule } from "@meetzeen/api/src/modules/invitations/invitations.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const invitationsRoutes = new Elysia({
  name: "invitationsRoutes",
  prefix: "/invitations",
})
  .use(betterAuthPlugin)
  .use(invitationsModule)
  .post(
    "/send",
    ({ invitationsService, body, user }) => {
      return invitationsService.createInvitation(
        body.email,
        body.role,
        user.id,
        body.organizationId
      );
    },
    {
      auth: true,
      body: t.Object({
        email: t.String(),
        role: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .get(
    "/verify",
    ({ invitationsService, query }) => {
      return invitationsService.verifyToken(query.token);
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    }
  )
  .post(
    "/accept",
    ({ invitationsService, body }) => {
      return invitationsService.acceptInvitation(body.token);
    },
    {
      body: t.Object({
        token: t.String(),
      }),
    }
  )
  .get(
    "/sended",
    ({ invitationsService, query }) => {
      return invitationsService.getSendedInvitations(query.organizationId);
    },
    {
      query: t.Object({
        organizationId: t.String(),
      }),
    }
  );
