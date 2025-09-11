import Elysia from "elysia";
import { EmployeesService } from "@meetzeen/api/src/modules/employees/employees.service";

export const employeesModule = new Elysia({
  name: "employeesModule",
}).decorate("employeesService", new EmployeesService());
