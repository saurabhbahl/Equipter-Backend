import { pgTable, uniqueIndex, unique, serial, text, varchar, uuid, numeric, timestamp, foreignKey, boolean, integer, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const developmentstatus = pgEnum("developmentstatus", ['Pending', 'InProgress', 'Completed', 'Delayed'])
export const financing = pgEnum("financing", ['cash', 'financing'])
export const installmentstatus = pgEnum("installmentstatus", ['Pending', 'Paid', 'Overdue'])
export const paymentmethod = pgEnum("paymentmethod", ['card'])
export const paymentstatus = pgEnum("paymentstatus", ['Pending', 'Completed', 'Failed', 'Refunded'])
export const role = pgEnum("role", ['admin', 'user'])
export const shippingmethodtype = pgEnum("shippingmethodtype", ['pickup', 'delivery'])
export const stages = pgEnum("stages", ['Quote', 'Saved', 'Ordered'])



export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	role: role("role").default('user').notNull(),
},
(table) => {
	return {
		uniqueEmailIdx: uniqueIndex("unique_email_idx").using("btree", table.email.asc().nullsLast()),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const zone = pgTable("zone", {
	id: uuid("id").primaryKey().notNull(),
	zoneName: text("zone_name"),
	shippingRate: numeric("shipping_rate"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const zonestate = pgTable("zonestate", {
	id: uuid("id").primaryKey().notNull(),
	zoneId: uuid("zone_id"),
	stateId: uuid("state_id"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		zonestateZoneIdFkey: foreignKey({
			columns: [table.zoneId],
			foreignColumns: [zone.id],
			name: "zonestate_zone_id_fkey"
		}),
		zonestateStateIdFkey: foreignKey({
			columns: [table.stateId],
			foreignColumns: [state.id],
			name: "zonestate_state_id_fkey"
		}),
	}
});

export const state = pgTable("state", {
	id: uuid("id").primaryKey().notNull(),
	stateName: text("state_name"),
	isDeliveryPaused: boolean("is_delivery_paused"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const product = pgTable("product", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name"),
	description: text("description"),
	gvwr: numeric("gvwr"),
	liftCapacity: numeric("lift_capacity"),
	liftHeight: numeric("lift_height"),
	productTitle: text("product_title"),
	productUrl: text("product_url"),
	containerCapacity: numeric("container_capacity"),
	price: numeric("price"),
	downpaymentCost: numeric("downpayment_cost"),
	metaTitle: text("meta_title"),
	stockQuantity: numeric("stock_quantity"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const productimage = pgTable("productimage", {
	id: uuid("id").primaryKey().notNull(),
	productId: uuid("product_id"),
	imageUrl: text("image_url"),
	imageDescription: text("image_description"),
	isFeatured: boolean("is_featured"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		productimageProductIdFkey: foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "productimage_product_id_fkey"
		}),
	}
});

export const shippingmethod = pgTable("shippingmethod", {
	id: uuid("id").primaryKey().notNull(),
	methodType: shippingmethodtype("method_type"),
	name: text("name"),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const accessoryproduct = pgTable("accessoryproduct", {
	id: uuid("id").primaryKey().notNull(),
	productId: uuid("product_id"),
	accessoryId: uuid("accessory_id"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		accessoryproductProductIdFkey: foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "accessoryproduct_product_id_fkey"
		}),
		accessoryproductAccessoryIdFkey: foreignKey({
			columns: [table.accessoryId],
			foreignColumns: [accessory.id],
			name: "accessoryproduct_accessory_id_fkey"
		}),
	}
});

export const accessory = pgTable("accessory", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name"),
	description: text("description"),
	metaTitle: text("meta_title"),
	accessoryTitle: text("accessory_title"),
	accessoryUrl: text("accessory_url"),
	price: numeric("price"),
	stockQuantity: numeric("stock_quantity"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const accessoryimage = pgTable("accessoryimage", {
	id: uuid("id").primaryKey().notNull(),
	accessoryId: uuid("accessory_id"),
	imageUrl: text("image_url"),
	imageDescription: text("image_description"),
	isFeatured: boolean("is_featured"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		accessoryimageAccessoryIdFkey: foreignKey({
			columns: [table.accessoryId],
			foreignColumns: [accessory.id],
			name: "accessoryimage_accessory_id_fkey"
		}),
	}
});

export const webquote = pgTable("webquote", {
	id: uuid("id").primaryKey().notNull(),
	webquoteUrl: text("webquote_url"),
	stage: stages("stage"),
	financing: financing("financing"),
	productId: uuid("product_id"),
	productName: text("product_name"),
	productPrice: numeric("product_price"),
	productQty: integer("product_qty"),
	shippingMethodId: uuid("shipping_method_id"),
	zoneId: uuid("zone_id"),
	contactFirstName: text("contact_first_name"),
	contactLastName: text("contact_last_name"),
	contactCompanyName: text("contact_company_name"),
	contactPhoneNumber: text("contact_phone_number"),
	contactEmail: text("contact_email"),
	contactIndustry: text("contact_industry"),
	contactJobTitle: text("contact_job_title"),
	billingSameAsDelivery: boolean("billing_same_as_delivery"),
	billingAddressStreet: text("billing_address_street"),
	billingAddressCity: text("billing_address_city"),
	billingAddressState: text("billing_address_state"),
	billingAddressZipCode: text("billing_address_zip_code"),
	billingAddressCountry: text("billing_address_country"),
	deliveryCost: numeric("delivery_cost"),
	deliveryAddressStreet: text("delivery_address_street"),
	deliveryAddressCity: text("delivery_address_city"),
	deliveryAddressStateId: uuid("delivery_address_state_id"),
	deliveryAddressZipCode: text("delivery_address_zip_code"),
	deliveryAddressCountry: text("delivery_address_country"),
	estimatedDeliveryDate: timestamp("estimated_delivery_date", { mode: 'string' }),
	pickupLocationName: text("pickup_location_name"),
	pickupLocationAddress: text("pickup_location_address"),
	pickupScheduledDate: timestamp("pickup_scheduled_date", { mode: 'string' }),
	paymentType: text("payment_type"),
	productTotalCost: numeric("product_total_cost"),
	nonRefundableDeposit: numeric("non_refundable_deposit"),
	iUnderstandDepositIsNonRefundable: boolean("i_understand_deposit_is_non_refundable"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		webquoteProductIdFkey: foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "webquote_product_id_fkey"
		}),
		webquoteShippingMethodIdFkey: foreignKey({
			columns: [table.shippingMethodId],
			foreignColumns: [shippingmethod.id],
			name: "webquote_shipping_method_id_fkey"
		}),
		webquoteZoneIdFkey: foreignKey({
			columns: [table.zoneId],
			foreignColumns: [zone.id],
			name: "webquote_zone_id_fkey"
		}),
		webquoteDeliveryAddressStateIdFkey: foreignKey({
			columns: [table.deliveryAddressStateId],
			foreignColumns: [state.id],
			name: "webquote_delivery_address_state_id_fkey"
		}),
		webquoteWebquoteUrlKey: unique("webquote_webquote_url_key").on(table.webquoteUrl),
	}
});

export const installmentstracking = pgTable("installmentstracking", {
	id: uuid("id").primaryKey().notNull(),
	emiPlanId: uuid("emi_plan_id"),
	installmentNumber: integer("installment_number"),
	dueDate: timestamp("due_date", { mode: 'string' }),
	amount: numeric("amount"),
	paymentStatus: installmentstatus("payment_status"),
	paymentDate: timestamp("payment_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		installmentstrackingEmiPlanIdFkey: foreignKey({
			columns: [table.emiPlanId],
			foreignColumns: [emiplan.id],
			name: "installmentstracking_emi_plan_id_fkey"
		}),
	}
});

export const quoteaccessory = pgTable("quoteaccessory", {
	id: uuid("id").primaryKey().notNull(),
	webquoteId: uuid("webquote_id"),
	accessoryId: uuid("accessory_id"),
	accessoryName: text("accessory_name"),
	quantity: numeric("quantity"),
	unitPrice: numeric("unit_price"),
	totalPrice: numeric("total_price"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		quoteaccessoryWebquoteIdFkey: foreignKey({
			columns: [table.webquoteId],
			foreignColumns: [webquote.id],
			name: "quoteaccessory_webquote_id_fkey"
		}),
		quoteaccessoryAccessoryIdFkey: foreignKey({
			columns: [table.accessoryId],
			foreignColumns: [accessory.id],
			name: "quoteaccessory_accessory_id_fkey"
		}),
	}
});

export const fullpayment = pgTable("fullpayment", {
	id: uuid("id").primaryKey().notNull(),
	webquoteId: uuid("webquote_id"),
	paymentMethod: paymentmethod("payment_method"),
	paymentStatus: paymentstatus("payment_status"),
	totalPaymentAmount: numeric("total_payment_amount"),
	transactionReference: text("transaction_reference"),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		fullpaymentWebquoteIdFkey: foreignKey({
			columns: [table.webquoteId],
			foreignColumns: [webquote.id],
			name: "fullpayment_webquote_id_fkey"
		}),
	}
});

export const emiplan = pgTable("emiplan", {
	id: uuid("id").primaryKey().notNull(),
	webquoteId: uuid("webquote_id"),
	financingRateConfigId: uuid("financing_rate_config_id"),
	totalFinancedAmount: numeric("total_financed_amount"),
	monthlyEmiAmount: numeric("monthly_emi_amount"),
	numberOfInstallments: integer("number_of_installments"),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		emiplanWebquoteIdFkey: foreignKey({
			columns: [table.webquoteId],
			foreignColumns: [webquote.id],
			name: "emiplan_webquote_id_fkey"
		}),
		emiplanFinancingRateConfigIdFkey: foreignKey({
			columns: [table.financingRateConfigId],
			foreignColumns: [financingrateconfig.id],
			name: "emiplan_financing_rate_config_id_fkey"
		}),
	}
});

export const financingrateconfig = pgTable("financingrateconfig", {
	id: uuid("id").primaryKey().notNull(),
	interestRate: numeric("interest_rate"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const emitransaction = pgTable("emitransaction", {
	id: uuid("id").primaryKey().notNull(),
	installmentTrackingId: uuid("installment_tracking_id"),
	transactionReference: text("transaction_reference"),
	transactionAmount: numeric("transaction_amount"),
	transactionStatus: paymentstatus("transaction_status"),
	paymentMethod: paymentmethod("payment_method"),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		emitransactionInstallmentTrackingIdFkey: foreignKey({
			columns: [table.installmentTrackingId],
			foreignColumns: [installmentstracking.id],
			name: "emitransaction_installment_tracking_id_fkey"
		}),
	}
});

export const order = pgTable("Order", {
	id: uuid("id").primaryKey().notNull(),
	webquoteId: uuid("webquote_id"),
	orderStatus: developmentstatus("order_status"),
	estimatedCompletionDate: timestamp("estimated_completion_date", { mode: 'string' }),
	actualCompletionDate: timestamp("actual_completion_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		orderWebquoteIdFkey: foreignKey({
			columns: [table.webquoteId],
			foreignColumns: [webquote.id],
			name: "Order_webquote_id_fkey"
		}),
	}
});

export const developmentstage = pgTable("developmentstage", {
	id: uuid("id").primaryKey().notNull(),
	productOrderId: uuid("product_order_id"),
	stageName: text("stage_name"),
	stageStatus: developmentstatus("stage_status"),
	startedAt: timestamp("started_at", { mode: 'string' }),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	remarks: text("remarks"),
	delayReason: text("delay_reason"),
	estimatedCompletionDate: timestamp("estimated_completion_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		developmentstageProductOrderIdFkey: foreignKey({
			columns: [table.productOrderId],
			foreignColumns: [order.id],
			name: "developmentstage_product_order_id_fkey"
		}),
	}
});