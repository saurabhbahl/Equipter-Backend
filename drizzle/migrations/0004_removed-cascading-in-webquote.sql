ALTER TABLE "development_stage" DROP CONSTRAINT "development_stage_product_order_id_order_id_fk";
--> statement-breakpoint
ALTER TABLE "emi_plan" DROP CONSTRAINT "emi_plan_webquote_id_web_quote_id_fk";
--> statement-breakpoint
ALTER TABLE "emi_plan" DROP CONSTRAINT "emi_plan_financing_rate_config_id_financing_rate_config_id_fk";
--> statement-breakpoint
ALTER TABLE "emi_transaction" DROP CONSTRAINT "emi_transaction_installment_tracking_id_installments_tracking_id_fk";
--> statement-breakpoint
ALTER TABLE "full_payment" DROP CONSTRAINT "full_payment_webquote_id_web_quote_id_fk";
--> statement-breakpoint
ALTER TABLE "installments_tracking" DROP CONSTRAINT "installments_tracking_emi_plan_id_emi_plan_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_webquote_id_web_quote_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_shipping_method_id_shipping_method_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_zone_id_zone_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_delivery_address_state_id_state_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_stage" ADD CONSTRAINT "development_stage_product_order_id_order_id_fk" FOREIGN KEY ("product_order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_plan" ADD CONSTRAINT "emi_plan_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_plan" ADD CONSTRAINT "emi_plan_financing_rate_config_id_financing_rate_config_id_fk" FOREIGN KEY ("financing_rate_config_id") REFERENCES "public"."financing_rate_config"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_transaction" ADD CONSTRAINT "emi_transaction_installment_tracking_id_installments_tracking_id_fk" FOREIGN KEY ("installment_tracking_id") REFERENCES "public"."installments_tracking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "full_payment" ADD CONSTRAINT "full_payment_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "installments_tracking" ADD CONSTRAINT "installments_tracking_emi_plan_id_emi_plan_id_fk" FOREIGN KEY ("emi_plan_id") REFERENCES "public"."emi_plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_zone_id_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zone"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_delivery_address_state_id_state_id_fk" FOREIGN KEY ("delivery_address_state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
