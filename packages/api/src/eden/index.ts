import type { Api as server } from "@meetzeen/api/src";
import { treaty } from "@elysiajs/eden";

export const createApiClient = (url: string) =>
  treaty<server>(url).api;