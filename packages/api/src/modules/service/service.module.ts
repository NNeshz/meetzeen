import Elysia from "elysia";
import { ServiceService } from "@meetzeen/api/src/modules/service/service.service";

export const serviceModule = new Elysia({
  name: "serviceModule",
}).decorate("serviceService", new ServiceService());
