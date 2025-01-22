import { pgTable, integer,uuid,uniqueIndex, text, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import {
  financing,
  stages,
  shippingMethodType,
  paymentMethod,
  paymentStatus,
  installmentStatus,
  developmentStatus,
  orderStatus,
} from "./enums.js";

// 1
export const zone = pgTable("zone", {
  id: uuid("id").primaryKey().defaultRandom(),
  zone_name: text("zone_name").notNull(),
  shipping_rate: numeric("shipping_rate"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 2

export const state = pgTable("state", {
  id: uuid("id").primaryKey().defaultRandom(),
  state_name: text("state_name").notNull(),
  is_delivery_paused: boolean("is_delivery_paused").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 3
export const zoneState = pgTable("zone_state", {
  id: uuid("id").primaryKey().defaultRandom(),
  zone_id: uuid("zone_id").references(() => zone.id,{onDelete:"cascade"}),
  state_id: uuid("state_id").references(() => state.id,{onDelete:"cascade"}),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 4
export const product = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  gvwr: numeric("gvwr"),
  lift_capacity: numeric("lift_capacity"),
  lift_height: numeric("lift_height"),
  product_title: text("product_title"),
  product_url: text("product_url"),
  container_capacity: numeric("container_capacity"),
  price: numeric("price").notNull(),
  downpayment_cost: numeric("downpayment_cost"),
  meta_title: text("meta_title"),
  stock_quantity: numeric("stock_quantity"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 5
export const productImage = pgTable("product_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => product.id,{onDelete:"cascade"}),
  image_url: text("image_url").notNull(),
  image_description: text("image_description"),
  is_featured: boolean("is_featured"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
// 6
export const accessory = pgTable("accessory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  meta_title: text("meta_title"),
  accessory_title: text("accessory_title"),
  accessory_url: text("accessory_url"),
  price: numeric("price").notNull(),
  stock_quantity: numeric("stock_quantity"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//7
export const accessoryImage = pgTable("accessory_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  accessory_id: uuid("accessory_id").references(() => accessory.id,{onDelete:"cascade"}),
  image_url: text("image_url").notNull(),
  image_description: text("image_description"),
  is_featured: boolean("is_featured"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//18
export const accessoryProduct = pgTable("accessory_product", {
  id: uuid("id").primaryKey().defaultRandom(),
  accessory_id: uuid("accessory_id").references(() => accessory.id,{onDelete:"cascade"}),
  product_id: uuid("product_id").references(() => product.id,{onDelete:"cascade"}),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//8
export const shippingMethod = pgTable("shipping_method", {
  id: uuid("id").primaryKey().defaultRandom(),
  method_type: shippingMethodType("method_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 9
export const webQuote = pgTable("web_quote", {
  id: uuid("id").primaryKey().defaultRandom(),
  stage: stages("stage").notNull().default("Quote"),
  financing: text("financing").notNull().default("cash"),
  product_id: uuid("product_id").references(() => product.id),
  product_name: text("product_name").notNull(),
  product_price: numeric("product_price").notNull(),
  product_qty: integer("product_qty").notNull(),
  shipping_method_used: shippingMethodType("shipping_method_used").default("pickup"),
  zone_id: uuid("zone_id").references(() => zone.id,{onDelete:"set null"}),
  contact_first_name: text("contact_first_name").notNull(),
  contact_last_name: text("contact_last_name").notNull(),
  contact_company_name: text("contact_company_name"),
  contact_phone_number: text("contact_phone_number").notNull(),
  contact_email: text("contact_email").notNull(),
  contact_industry: text("contact_industry"),
  contact_job_title: text("contact_job_title"),
  billing_same_as_delivery: boolean("billing_same_as_delivery"),
  billing_address_street: text("billing_address_street"),
  billing_address_city: text("billing_address_city"),
  billing_address_state: text("billing_address_state"),
  billing_address_zip_code: text("billing_address_zip_code"),
  billing_address_country: text("billing_address_country"),
  delivery_cost: numeric("delivery_cost"),
  delivery_address_street: text("delivery_address_street"),
  delivery_address_city: text("delivery_address_city"),
  delivery_address_state_id: text("delivery_address_state_id"),
  delivery_address_zip_code: text("delivery_address_zip_code"),
  delivery_address_country: text("delivery_address_country"),
  payment_type: text("payment_type"),
  product_total_cost: numeric("product_total_cost"),
  non_refundable_deposit: numeric("non_refundable_deposit"),
  i_understand_deposit_is_non_refundable: boolean(
    "i_understand_deposit_is_non_refundable"
  ),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//   10

export const quoteAccessory = pgTable("quote_accessory", {
  id: uuid("id").primaryKey().defaultRandom(),
  webquote_id: uuid("webquote_id").references(() => webQuote.id,{onDelete:"cascade"}),
  accessory_id: uuid("accessory_id").references(() => accessory.id,{onDelete:"cascade"}),
  accessory_name: text("accessory_name").notNull(),
  quantity: numeric("quantity").notNull(),
  unit_price: numeric("unit_price").notNull(),
  total_price: numeric("total_price").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//11
export const fullPayment = pgTable("full_payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  webquote_id: uuid("webquote_id").references(() => webQuote.id),
  payment_method: paymentMethod("payment_method").notNull(),
  payment_status: paymentStatus("payment_status").notNull(),
  total_payment_amount: numeric("total_payment_amount").notNull(),
  transaction_reference: text("transaction_reference").notNull(),
  processed_at: timestamp("processed_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
},(fullPayment) => ({
  uniqueWebQuotePaymentConstraint: uniqueIndex("unique_webquote_fullpayment").on(fullPayment.webquote_id),
}));

// 12
export const financingRateConfig = pgTable("financing_rate_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  interest_rate: numeric("interest_rate").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 13
export const emiPlan = pgTable("emi_plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  webquote_id: uuid("webquote_id").references(() => webQuote.id,{onDelete:"set null",onUpdate:"set null"}),
  financing_rate_config_id: uuid("financing_rate_config_id").references(() => financingRateConfig.id),
  total_financed_amount: numeric("total_financed_amount").notNull(),
  monthly_emi_amount: numeric("monthly_emi_amount").notNull(),
  number_of_installments: integer("number_of_installments").notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (emiPlan) => ({
  uniqueWebQuoteEMIConstraint: uniqueIndex("unique_webquote_emiplan").on(emiPlan.webquote_id),
}));


//14
export const installmentsTracking = pgTable("installments_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  emi_plan_id: uuid("emi_plan_id").references(() => emiPlan.id),
  installment_number: integer("installment_number").notNull(),
  due_date: timestamp("due_date").notNull(),
  amount: numeric("amount").notNull(),
  payment_status: installmentStatus("payment_status").notNull(),
  payment_date: timestamp("payment_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//15
export const emiTransaction = pgTable("emi_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  installment_tracking_id: uuid("installment_tracking_id").references(
    () => installmentsTracking.id
  ),
  transaction_reference: text("transaction_reference").notNull(),
  transaction_amount: numeric("transaction_amount").notNull(),
  transaction_status: paymentStatus("transaction_status").notNull(),
  payment_method: paymentMethod("payment_method").notNull(),
  processed_at: timestamp("processed_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//16
export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_status: orderStatus("order_status").notNull(),
  webquote_id: uuid("webquote_id").references(() => webQuote.id,{onDelete:"set null",onUpdate:"set null"}),
  estimated_completion_date: timestamp("estimated_completion_date").notNull(),
  actual_completion_date: timestamp("actual_completion_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

//17
export const developmentStage = pgTable("development_stage", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_order_id: uuid("product_order_id").references(() => order.id,),
  stage_name: text("stage_name").notNull(),
  stage_status: developmentStatus("stage_status").notNull(),
  started_at: timestamp("started_at"),
  completed_at: timestamp("completed_at"),
  remarks: text("remarks"),
  delay_reason: text("delay_reason"),
  estimated_completion_date: timestamp("estimated_completion_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});