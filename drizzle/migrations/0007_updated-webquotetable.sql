ALTER TABLE "web_quote" ADD COLUMN "stage" "stages" DEFAULT 'Quote' NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "financing" text DEFAULT 'cash' NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "product_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "product_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "product_qty" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "shipping_method_used" "shippingmethodtype" DEFAULT 'pickup';--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "zone_id" uuid;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_company_name" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_phone_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_industry" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "contact_job_title" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_same_as_delivery" boolean;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_address_street" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_address_city" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_address_state" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_address_zip_code" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "billing_address_country" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_cost" numeric;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_address_street" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_address_city" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_address_state_id" uuid;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_address_zip_code" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "delivery_address_country" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "payment_type" text;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "product_total_cost" numeric;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "non_refundable_deposit" numeric;--> statement-breakpoint
ALTER TABLE "web_quote" ADD COLUMN "i_understand_deposit_is_non_refundable" boolean;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
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
