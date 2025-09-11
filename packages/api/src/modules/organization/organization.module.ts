import Elysia from "elysia";
import { OrganizationService } from "@meetzeen/api/src/modules/organization/organization.service";

export const organizationModule = new Elysia({
  name: "organizationModule",
}).decorate("organizationService", new OrganizationService());
