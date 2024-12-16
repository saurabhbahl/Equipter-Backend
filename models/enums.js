import { pgEnum } from "drizzle-orm/pg-core";

export const financing = pgEnum("financing", ["cash", "financing"]);
export const stages = pgEnum("stages", ["Quote", "Saved", "Ordered"]);
export const shippingMethodType = pgEnum("shippingmethodtype", ["pickup", "delivery"]);
export const paymentMethod = pgEnum("paymentmethod", ["card"]);
export const paymentStatus = pgEnum("paymentstatus", ["Pending", "Completed", "Failed", "Refunded"]);
export const installmentStatus = pgEnum("installmentstatus", ["Pending", "Paid", "Overdue"]);
export const developmentStatus = pgEnum("developmentstatus", ["Pending", "InProgress", "Completed", "Delayed"]);
