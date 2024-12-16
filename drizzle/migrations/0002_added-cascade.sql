ALTER TABLE "accessory_product" DROP CONSTRAINT "accessory_product_accessory_id_accessory_id_fk";
--> statement-breakpoint
ALTER TABLE "accessory_product" DROP CONSTRAINT "accessory_product_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "development_stage" DROP CONSTRAINT "development_stage_product_order_id_order_id_fk";
--> statement-breakpoint
ALTER TABLE "order" DROP CONSTRAINT "order_webquote_id_web_quote_id_fk";
--> statement-breakpoint
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "quote_accessory" DROP CONSTRAINT "quote_accessory_webquote_id_web_quote_id_fk";
--> statement-breakpoint
ALTER TABLE "quote_accessory" DROP CONSTRAINT "quote_accessory_accessory_id_accessory_id_fk";
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
 ALTER TABLE "accessory_product" ADD CONSTRAINT "accessory_product_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accessory_product" ADD CONSTRAINT "accessory_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_stage" ADD CONSTRAINT "development_stage_product_order_id_order_id_fk" FOREIGN KEY ("product_order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote_accessory" ADD CONSTRAINT "quote_accessory_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote_accessory" ADD CONSTRAINT "quote_accessory_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_shipping_method_id_shipping_method_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_zone_id_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zone"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_delivery_address_state_id_state_id_fk" FOREIGN KEY ("delivery_address_state_id") REFERENCES "public"."state"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
