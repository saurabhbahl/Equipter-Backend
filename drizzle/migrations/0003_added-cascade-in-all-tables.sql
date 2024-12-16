ALTER TABLE "accessory_image" DROP CONSTRAINT "accessory_image_accessory_id_accessory_id_fk";
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
ALTER TABLE "zone_state" DROP CONSTRAINT "zone_state_zone_id_zone_id_fk";
--> statement-breakpoint
ALTER TABLE "zone_state" DROP CONSTRAINT "zone_state_state_id_state_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accessory_image" ADD CONSTRAINT "accessory_image_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_plan" ADD CONSTRAINT "emi_plan_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_plan" ADD CONSTRAINT "emi_plan_financing_rate_config_id_financing_rate_config_id_fk" FOREIGN KEY ("financing_rate_config_id") REFERENCES "public"."financing_rate_config"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_transaction" ADD CONSTRAINT "emi_transaction_installment_tracking_id_installments_tracking_id_fk" FOREIGN KEY ("installment_tracking_id") REFERENCES "public"."installments_tracking"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "full_payment" ADD CONSTRAINT "full_payment_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "installments_tracking" ADD CONSTRAINT "installments_tracking_emi_plan_id_emi_plan_id_fk" FOREIGN KEY ("emi_plan_id") REFERENCES "public"."emi_plan"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zone_state" ADD CONSTRAINT "zone_state_zone_id_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zone"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zone_state" ADD CONSTRAINT "zone_state_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
