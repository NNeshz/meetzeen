import Elysia from "elysia";
import { CategoriesService } from "@meetzeen/api/src/modules/categories/categories.service";

export const categoriesModule = new Elysia({
  name: "categoriesModule",
}).decorate("categoriesService", new CategoriesService());