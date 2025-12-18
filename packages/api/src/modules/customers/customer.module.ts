import Elysia from "elysia";
import { CustomerService } from "@meetzeen/api/src/modules/customers/customer.service";

export const customerModule = new Elysia({
  name: "customerModule",
}).decorate("customerService", new CustomerService());