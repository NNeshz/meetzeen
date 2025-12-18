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
  time,
  uniqueIndex,
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
    dayOfWeek: integer().notNull(), // 0=Sunday, 1=Monday, ..., 6=Saturday
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

export const customer = pgTable(
  "Customer",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull(),
    phoneNumber: text(),
    organizationId: text().notNull(),
    totalAppointments: integer().notNull().default(0),
    lastAppointmentDate: timestamp({
      precision: 3,
      mode: "string",
      withTimezone: true,
    }),
    notes: text(),

    isActive: boolean().notNull().default(true),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("Customer_email_org_key").on(table.email, table.organizationId),
    index("Customer_email_idx").on(table.email),
    index("Customer_phone_idx").on(table.phoneNumber),
    index("Customer_org_idx").on(table.organizationId),
    index("Customer_active_idx").on(table.isActive),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Customer_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const appointment = pgTable(
  "Appointment",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),

    customerId: text(),
    memberId: text(),
    serviceId: text(),
    organizationId: text().notNull(),

    customerName: text().notNull(),
    customerEmail: text().notNull(),
    customerPhone: text(),
    customerNotes: text(),

    memberName: text().notNull(),
    memberEmail: text().notNull(),
    memberRole: text(),

    appointmentDate: text().notNull(), // Formato YYYY-MM-DD
    startTime: text().notNull(),
    endTime: time().notNull(),

    status: text().notNull(), // "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
    notes: text(),

    cancellationReason: text(),
    cancelledAt: timestamp({
      precision: 3,
      mode: "string",
      withTimezone: true,
    }),
    cancelledBy: text(), // "customer" | "member"

    paymentStatus: text().notNull(), // "pending" | "paid" | "refunded"
    paymentMethod: text(), // "cash" | "card" | "bank_transfer" | "other"
    amountPaid: numeric().notNull(),

    source: text().default("manual"), // "manual" | "online" | "api"
    reminderSent: boolean().default(false),
    reminderSentAt: timestamp({
      precision: 3,
      mode: "string",
      withTimezone: true,
    }),

    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.customerId],
      foreignColumns: [customer.id],
      name: "Appointment_customerId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),

    foreignKey({
      columns: [table.memberId],
      foreignColumns: [member.id],
      name: "Appointment_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),

    foreignKey({
      columns: [table.serviceId],
      foreignColumns: [service.id],
      name: "Appointment_serviceId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),

    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Appointment_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("Appointment_customer_idx").on(table.customerId),
    index("Appointment_member_idx").on(table.memberId),
    index("Appointment_date_idx").on(table.appointmentDate),
    index("Appointment_status_idx").on(table.status),
    index("Appointment_org_date_idx").on(
      table.organizationId,
      table.appointmentDate
    ),
    index("Appointment_member_date_time_idx").on(
      table.memberId,
      table.appointmentDate,
      table.startTime
    ),
    index("Appointment_customer_email_idx").on(table.customerEmail),
  ]
);

export const servicesBooked = pgTable(
  "ServicesBooked",
  {
    id: text()
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    appointmentId: text().notNull(),
    
    serviceId: text(),

    serviceName: text().notNull(),
    servicePrice: numeric().notNull(),
    serviceDuration: integer().notNull(),
    serviceDiscount: integer(),
    
    serviceTotal: numeric().notNull(),
    serviceDiscountTotal: numeric().notNull(),
    
    order: integer().notNull().default(0),
    
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.appointmentId],
      foreignColumns: [appointment.id],
      name: "ServicesBooked_appointmentId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.serviceId],
      foreignColumns: [service.id],
      name: "ServicesBooked_serviceId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("ServicesBooked_appointmentId_idx").on(table.appointmentId),
    index("ServicesBooked_serviceId_idx").on(table.serviceId),
  ]
);

// ============================================================================
// RELACIONES
// ============================================================================

export const weeklyScheduleTemplateRelations = relations(
  weeklyScheduleTemplate,
  ({ one }) => ({
    member: one(member, {
      fields: [weeklyScheduleTemplate.memberId],
      references: [member.id],
    }),
  })
);

export const dailyAvailabilityRelations = relations(
  dailyAvailability,
  ({ one }) => ({
    member: one(member, {
      fields: [dailyAvailability.memberId],
      references: [member.id],
    }),
  })
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

export const customerRelations = relations(customer, ({ one, many }) => ({
  organization: one(organization, {
    fields: [customer.organizationId],
    references: [organization.id],
  }),
  appointments: many(appointment),
}));

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
  customer: one(customer, {
    fields: [appointment.customerId],
    references: [customer.id],
  }),
  member: one(member, {
    fields: [appointment.memberId],
    references: [member.id],
  }),
  service: one(service, {
    fields: [appointment.serviceId],
    references: [service.id],
  }),
  organization: one(organization, {
    fields: [appointment.organizationId],
    references: [organization.id],
  }),
  servicesBooked: many(servicesBooked),
}));

export const servicesBookedRelations = relations(servicesBooked, ({ one }) => ({
  appointment: one(appointment, {
    fields: [servicesBooked.appointmentId],
    references: [appointment.id],
  }),
  service: one(service, {
    fields: [servicesBooked.serviceId],
    references: [service.id],
  }),
}));
