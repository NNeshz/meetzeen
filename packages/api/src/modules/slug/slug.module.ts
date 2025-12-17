import Elysia from "elysia";
import { SlugService } from "@meetzeen/api/src/modules/slug/slug.service";

export const slugModule = new Elysia({
  name: "slugModule",
}).decorate("slugService", new SlugService());