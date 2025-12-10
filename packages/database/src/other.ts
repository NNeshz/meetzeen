import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";
import { organization, member } from "./schema";
import { relations, sql } from "drizzle-orm";

export const serviceCategory = pgTable(
  "ServiceCategory",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()`),
    name: text().notNull(),
    organizationId: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "ServiceCategory_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const service = pgTable(
  "Service",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()`),
    name: text().notNull(),
    serviceCategoryId: text(),
    description: text(),
    price: numeric().notNull(),
    duration: integer().notNull(),
    discount: integer(),
    organizationId: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Service_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.serviceCategoryId],
      foreignColumns: [serviceCategory.id],
      name: "Service_serviceCategoryId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);