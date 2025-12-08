import Elysia from "elysia";
import { InvitationsService } from "@meetzeen/api/src/modules/invitations/invitations.service";

export const invitationsModule = new Elysia({
  name: "invitationsModule",
}).decorate("invitationsService", new InvitationsService());