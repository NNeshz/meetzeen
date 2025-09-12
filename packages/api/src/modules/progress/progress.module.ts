import Elysia from "elysia";
import { ProgressService } from "@meetzeen/api/src/modules/progress/progress.service";

export const progressModule = new Elysia({
  name: "progressModule",
}).decorate("progressService", new ProgressService())