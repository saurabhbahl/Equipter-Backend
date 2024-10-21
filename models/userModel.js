import {
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoles = pgEnum("role", ["admin", "user"]);
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoles("role").default("user").notNull(),
  },
  (users) => ({
    uniqueEmailIndex: uniqueIndex("unique_email_idx").on(users.email),
  })
);
