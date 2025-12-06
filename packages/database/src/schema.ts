import {
  pgTable,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable(
  "User",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    image: text().notNull(),
    phoneNumber: text().unique(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    phoneNumberVerified: boolean(),
    isAnonymous: boolean(),
    banned: boolean(),
    banReason: text(),
    banExpires: timestamp({ precision: 3, mode: "string" }),
    createdAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast()),
    uniqueIndex("User_phoneNumber_key").using(
      "btree",
      table.phoneNumber.asc().nullsLast()
    ),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  invitations: many(invitation),
  members: many(member),
}));

export const session = pgTable(
  "Session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text().notNull(),
    activeOrganizationId: text(),
    impersonatedBy: text(),
  },
  (table) => [
    uniqueIndex("Session_token_key").using(
      "btree",
      table.token.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Session_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const account = pgTable(
  "Account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ precision: 3, mode: "string" }),
    refreshTokenExpiresAt: timestamp({ precision: 3, mode: "string" }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Account_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = pgTable("Verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" }),
  updatedAt: timestamp({ precision: 3, mode: "string" }),
});

// ============================================
// Organization Table
// ============================================
export const organization = pgTable(
  "Organization",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    timezone: text(),
    currency: text(),
    slug: text(),
    logo: text(),
    createdAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    metadata: text(),
  },
  (table) => [
    uniqueIndex("Organization_slug_key").using(
      "btree",
      table.slug.asc().nullsLast()
    ),
  ]
);

export const organizationRelations = relations(organization, ({ many }) => ({
  invitations: many(invitation),
  members: many(member),
}));

// ============================================
// Member Table
// ============================================
export const member = pgTable(
  "Member",
  {
    id: text().primaryKey().notNull(),
    organizationId: text().notNull(),
    userId: text().notNull(),
    role: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Member_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Member_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

// ============================================
// Invitation Table
// ============================================
export const invitation = pgTable(
  "Invitation",
  {
    id: text().primaryKey().notNull(),
    organizationId: text().notNull(),
    email: text().notNull(),
    role: text(),
    status: text().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    inviterId: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.inviterId],
      foreignColumns: [user.id],
      name: "Invitation_inviterId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: "Invitation_organizationId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));
