import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  foreignKey,
  jsonb,
  boolean,
  index,
  date,
} from "drizzle-orm/pg-core";
import { organization, member } from "./schema";
import { relations, sql } from "drizzle-orm";
import type { TimeBlock } from "@meetzeen/api/src/modules/team/types/team.types.ts";

export const serviceCategory = pgTable(
  "ServiceCategory",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
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
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
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

export const weeklyScheduleTemplate = pgTable(
  "WeeklyScheduleTemplate",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    memberId: text().notNull(),
    dayOfWeek: integer().notNull(), // 0-6 (0: Sunday, 6: Saturday)
    timeBlocks: jsonb().$type<Array<TimeBlock>>().notNull(),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.memberId],
      foreignColumns: [member.id],
      name: "WeeklyScheduleTemplate_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("WeeklyScheduleTemplate_memberId_idx").on(table.memberId),
  ]
);

export const weeklyScheduleTemplateRelations = relations(
  weeklyScheduleTemplate,
  ({ one }) => ({
    member: one(member, {
      fields: [weeklyScheduleTemplate.memberId],
      references: [member.id],
    }),
  })
);

export const dailyAvailability = pgTable(
  "DailyAvailability",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    memberId: text().notNull(),
    date: date().notNull(),
    timeBlocks: jsonb().$type<Array<TimeBlock>>().notNull().default([]),
    // Metadata util
    isWorkingDay: boolean().notNull().default(true),
    source: text().notNull().default("manual"), // "template" | "custom" | "exception"
    reason: text(),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.memberId],
      foreignColumns: [member.id],
      name: "DailyAvailability_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("DailyAvailability_memberId_date_idx").on(table.memberId, table.date),
    index("DailyAvailability_date_idx").on(table.date),
    index("DailyAvailability_unique_member_date").on(
      table.memberId,
      table.date
    ),
  ]
);

export const dailyAvailabilityRelations = relations(dailyAvailability, ({ one }) => ({
  member: one(member, {
    fields: [dailyAvailability.memberId],
    references: [member.id],
  }),
}));


export const scheduleGenerationLog = pgTable(
  "ScheduleGenerationLog",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    memberId: text().notNull(),
    generatedFrom: date().notNull(),
    generatedUntil: date().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.memberId],
      foreignColumns: [member.id],
      name: "ScheduleGenerationLog_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("ScheduleGenerationLog_memberId_idx").on(table.memberId),
  ]
);

export const scheduleGenerationLogRelations = relations(
  scheduleGenerationLog,
  ({ one }) => ({
    member: one(member, {
      fields: [scheduleGenerationLog.memberId],
      references: [member.id],
    }),
  })
);