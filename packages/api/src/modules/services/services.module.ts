import Elysia from "elysia";
import { ServicesService } from "@meetzeen/api/src/modules/services/services.service";

export const servicesModule = new Elysia({
  name: "servicesModule",
}).decorate("servicesService", new ServicesService());