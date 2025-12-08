import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  foreignKey,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { organization, member } from "./schema";
import { relations } from "drizzle-orm";

export const serviceCategory = pgTable(
  "ServiceCategory",
  {
    id: text().primaryKey().notNull(),
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
    id: text().primaryKey().notNull(),
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

export const baseSchedule = pgTable(
  "BaseSchedule",
  {
    id: text().primaryKey().notNull(),
    memberId: text().notNull(),
    // Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
    dayOfWeek: integer().notNull(),
    startTime: text().notNull(),
    endTime: text().notNull(),
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
      name: "BaseSchedule_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("BaseSchedule_memberId_dayOfWeek_idx").using(
      "btree",
      table.memberId.asc(),
      table.dayOfWeek.asc()
    ),
  ]
);

export const employeeAvailability = pgTable(
  "EmployeeAvailability",
  {
    id: text().primaryKey().notNull(),
    memberId: text().notNull(),
    date: text().notNull(),
    startTime: text().notNull(),
    endTime: text().notNull(),
    isAvailable: boolean().notNull(),
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
      name: "EmployeeAvailability_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("EmployeeAvailability_memberId_date_idx").using(
      "btree",
      table.memberId.asc(),
      table.date.asc()
    ),
  ]
);

export const appointmentType = pgTable(
  "AppointmentType",
  {
    id: text().primaryKey().notNull(),
    memberId: text().notNull(),
    name: text().notNull(),
    duration: integer().notNull(),
    price: numeric(),
    description: text(),
    requiresApproval: boolean().notNull().default(false),
    bufferBefore: integer().notNull().default(0),
    bufferAfter: integer().notNull().default(0),
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
      name: "AppointmentType_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("AppointmentType_memberId_idx").using("btree", table.memberId.asc()),
  ]
);

export const appointment = pgTable(
  "Appointment",
  {
    id: text().primaryKey().notNull(),
    appointmentTypeId: text().notNull(),
    memberId: text().notNull(),
    organizationId: text().notNull(),
    customerName: text().notNull(),
    customerEmail: text().notNull(),
    customerPhone: text(),
    date: text().notNull(),
    startTime: text().notNull(),
    endTime: text().notNull(),
    status: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp({ precision: 3, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.appointmentTypeId],
      foreignColumns: [appointmentType.id],
      name: "Appointment_appointmentTypeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.memberId],
      foreignColumns: [member.id],
      name: "Appointment_memberId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Appointment_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("Appointment_memberId_date_idx").using(
      "btree",
      table.memberId.asc(),
      table.date.asc()
    ),
    index("Appointment_organizationId_date_idx").using(
      "btree",
      table.organizationId.asc(),
      table.date.asc()
    ),
    index("Appointment_status_idx").using("btree", table.status.asc()),
  ]
);

export const baseScheduleRelations = relations(baseSchedule, ({ one }) => ({
  member: one(member, {
    fields: [baseSchedule.memberId],
    references: [member.id],
  }),
}));

export const employeeAvailabilityRelations = relations(
  employeeAvailability,
  ({ one }) => ({
    member: one(member, {
      fields: [employeeAvailability.memberId],
      references: [member.id],
    }),
  })
);

export const appointmentTypeRelations = relations(appointmentType, ({ one, many }) => ({
  member: one(member, {
    fields: [appointmentType.memberId],
    references: [member.id],
  }),
  appointments: many(appointment),
}));

export const appointmentRelations = relations(appointment, ({ one }) => ({
  appointmentType: one(appointmentType, {
    fields: [appointment.appointmentTypeId],
    references: [appointmentType.id],
  }),
  member: one(member, {
    fields: [appointment.memberId],
    references: [member.id],
  }),
  organization: one(organization, {
    fields: [appointment.organizationId],
    references: [organization.id],
  }),
}));