import Elysia from "elysia";
import { ServiceCategoryService } from "@meetzeen/api/src/modules/service-category/service-category.service";

export const serviceCategoryModule = new Elysia({
  name: "serviceCategoryModule",
}).decorate("serviceCategoryService", new ServiceCategoryService());
