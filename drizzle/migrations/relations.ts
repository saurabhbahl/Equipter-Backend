import { relations } from "drizzle-orm/relations";
import { zone, zonestate, state, product, productimage, accessoryproduct, accessory, accessoryimage, webquote, shippingmethod, emiplan, installmentstracking, quoteaccessory, fullpayment, financingrateconfig, emitransaction, order, developmentstage } from "./schema";

export const zonestateRelations = relations(zonestate, ({one}) => ({
	zone: one(zone, {
		fields: [zonestate.zoneId],
		references: [zone.id]
	}),
	state: one(state, {
		fields: [zonestate.stateId],
		references: [state.id]
	}),
}));

export const zoneRelations = relations(zone, ({many}) => ({
	zonestates: many(zonestate),
	webquotes: many(webquote),
}));

export const stateRelations = relations(state, ({many}) => ({
	zonestates: many(zonestate),
	webquotes: many(webquote),
}));

export const productimageRelations = relations(productimage, ({one}) => ({
	product: one(product, {
		fields: [productimage.productId],
		references: [product.id]
	}),
}));

export const productRelations = relations(product, ({many}) => ({
	productimages: many(productimage),
	accessoryproducts: many(accessoryproduct),
	webquotes: many(webquote),
}));

export const accessoryproductRelations = relations(accessoryproduct, ({one}) => ({
	product: one(product, {
		fields: [accessoryproduct.productId],
		references: [product.id]
	}),
	accessory: one(accessory, {
		fields: [accessoryproduct.accessoryId],
		references: [accessory.id]
	}),
}));

export const accessoryRelations = relations(accessory, ({many}) => ({
	accessoryproducts: many(accessoryproduct),
	accessoryimages: many(accessoryimage),
	quoteaccessories: many(quoteaccessory),
}));

export const accessoryimageRelations = relations(accessoryimage, ({one}) => ({
	accessory: one(accessory, {
		fields: [accessoryimage.accessoryId],
		references: [accessory.id]
	}),
}));

export const webquoteRelations = relations(webquote, ({one, many}) => ({
	product: one(product, {
		fields: [webquote.productId],
		references: [product.id]
	}),
	shippingmethod: one(shippingmethod, {
		fields: [webquote.shippingMethodId],
		references: [shippingmethod.id]
	}),
	zone: one(zone, {
		fields: [webquote.zoneId],
		references: [zone.id]
	}),
	state: one(state, {
		fields: [webquote.deliveryAddressStateId],
		references: [state.id]
	}),
	quoteaccessories: many(quoteaccessory),
	fullpayments: many(fullpayment),
	emiplans: many(emiplan),
	orders: many(order),
}));

export const shippingmethodRelations = relations(shippingmethod, ({many}) => ({
	webquotes: many(webquote),
}));

export const installmentstrackingRelations = relations(installmentstracking, ({one, many}) => ({
	emiplan: one(emiplan, {
		fields: [installmentstracking.emiPlanId],
		references: [emiplan.id]
	}),
	emitransactions: many(emitransaction),
}));

export const emiplanRelations = relations(emiplan, ({one, many}) => ({
	installmentstrackings: many(installmentstracking),
	webquote: one(webquote, {
		fields: [emiplan.webquoteId],
		references: [webquote.id]
	}),
	financingrateconfig: one(financingrateconfig, {
		fields: [emiplan.financingRateConfigId],
		references: [financingrateconfig.id]
	}),
}));

export const quoteaccessoryRelations = relations(quoteaccessory, ({one}) => ({
	webquote: one(webquote, {
		fields: [quoteaccessory.webquoteId],
		references: [webquote.id]
	}),
	accessory: one(accessory, {
		fields: [quoteaccessory.accessoryId],
		references: [accessory.id]
	}),
}));

export const fullpaymentRelations = relations(fullpayment, ({one}) => ({
	webquote: one(webquote, {
		fields: [fullpayment.webquoteId],
		references: [webquote.id]
	}),
}));

export const financingrateconfigRelations = relations(financingrateconfig, ({many}) => ({
	emiplans: many(emiplan),
}));

export const emitransactionRelations = relations(emitransaction, ({one}) => ({
	installmentstracking: one(installmentstracking, {
		fields: [emitransaction.installmentTrackingId],
		references: [installmentstracking.id]
	}),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	webquote: one(webquote, {
		fields: [order.webquoteId],
		references: [webquote.id]
	}),
	developmentstages: many(developmentstage),
}));

export const developmentstageRelations = relations(developmentstage, ({one}) => ({
	order: one(order, {
		fields: [developmentstage.productOrderId],
		references: [order.id]
	}),
}));