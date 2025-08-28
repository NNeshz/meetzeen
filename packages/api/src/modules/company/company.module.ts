import Elysia from "elysia";
import { CompanyService } from "@meetzeen/api/src/modules/company/company.service";

export const companyModule = new Elysia({
  name: "companyModule",
}).decorate("companyService", new CompanyService());
