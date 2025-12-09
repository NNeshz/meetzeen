import Elysia from "elysia";
import { CompanyService } from "@meetzeen/api/src/modules/company/company.service";
import { FilesService } from "@meetzeen/api/src/modules/buckets/buckets.service";

const filesService = new FilesService();

export const companyModule = new Elysia({
  name: "companyModule",
}).decorate("companyService", new CompanyService(filesService));
