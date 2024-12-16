DO $$ BEGIN
 CREATE TYPE "public"."developmentstatus" AS ENUM('Pending', 'InProgress', 'Completed', 'Delayed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."financing" AS ENUM('cash', 'financing');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."installmentstatus" AS ENUM('Pending', 'Paid', 'Overdue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."paymentmethod" AS ENUM('card');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."paymentstatus" AS ENUM('Pending', 'Completed', 'Failed', 'Refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."shippingmethodtype" AS ENUM('pickup', 'delivery');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."stages" AS ENUM('Quote', 'Saved', 'Ordered');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accessory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"meta_title" text,
	"accessory_title" text,
	"accessory_url" text,
	"price" numeric NOT NULL,
	"stock_quantity" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accessory_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accessory_id" uuid,
	"image_url" text NOT NULL,
	"image_description" text,
	"is_featured" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accessory_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accessory_id" uuid,
	"product_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "development_stage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_order_id" uuid,
	"stage_name" text NOT NULL,
	"stage_status" "developmentstatus" NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"remarks" text,
	"delay_reason" text,
	"estimated_completion_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emi_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webquote_id" uuid,
	"financing_rate_config_id" uuid,
	"total_financed_amount" numeric NOT NULL,
	"monthly_emi_amount" numeric NOT NULL,
	"number_of_installments" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emi_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"installment_tracking_id" uuid,
	"transaction_reference" text NOT NULL,
	"transaction_amount" numeric NOT NULL,
	"transaction_status" "paymentstatus" NOT NULL,
	"payment_method" "paymentmethod" NOT NULL,
	"processed_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financing_rate_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interest_rate" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "full_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webquote_id" uuid,
	"payment_method" "paymentmethod" NOT NULL,
	"payment_status" "paymentstatus" NOT NULL,
	"total_payment_amount" numeric NOT NULL,
	"transaction_reference" text NOT NULL,
	"processed_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "installments_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"emi_plan_id" uuid,
	"installment_number" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"amount" numeric NOT NULL,
	"payment_status" "installmentstatus" NOT NULL,
	"payment_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webquote_id" uuid,
	"order_status" "developmentstatus" NOT NULL,
	"estimated_completion_date" timestamp NOT NULL,
	"actual_completion_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"gvwr" numeric,
	"lift_capacity" numeric,
	"lift_height" numeric,
	"product_title" text,
	"product_url" text,
	"container_capacity" numeric,
	"price" numeric NOT NULL,
	"downpayment_cost" numeric,
	"meta_title" text,
	"stock_quantity" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"image_url" text NOT NULL,
	"image_description" text,
	"is_featured" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quote_accessory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webquote_id" uuid,
	"accessory_id" uuid,
	"accessory_name" text NOT NULL,
	"quantity" numeric NOT NULL,
	"unit_price" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipping_method" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"method_type" "shippingmethodtype" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state_name" text NOT NULL,
	"is_delivery_paused" boolean NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_quote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"webquote_url" text NOT NULL,
	"stage" "stages" NOT NULL,
	"financing" "financing" NOT NULL,
	"product_id" uuid,
	"product_name" text NOT NULL,
	"product_price" numeric NOT NULL,
	"product_qty" integer NOT NULL,
	"shipping_method_id" uuid,
	"zone_id" uuid,
	"contact_first_name" text NOT NULL,
	"contact_last_name" text NOT NULL,
	"contact_company_name" text,
	"contact_phone_number" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_industry" text,
	"contact_job_title" text,
	"billing_same_as_delivery" boolean,
	"billing_address_street" text,
	"billing_address_city" text,
	"billing_address_state" text,
	"billing_address_zip_code" text,
	"billing_address_country" text,
	"delivery_cost" numeric,
	"delivery_address_street" text,
	"delivery_address_city" text,
	"delivery_address_state_id" uuid,
	"delivery_address_zip_code" text,
	"delivery_address_country" text,
	"estimated_delivery_date" timestamp,
	"pickup_location_name" text,
	"pickup_location_address" text,
	"pickup_scheduled_date" timestamp,
	"payment_type" text,
	"product_total_cost" numeric,
	"non_refundable_deposit" numeric,
	"i_understand_deposit_is_non_refundable" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "web_quote_webquote_url_unique" UNIQUE("webquote_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zone" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_name" text NOT NULL,
	"shipping_rate" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zone_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_id" uuid,
	"state_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accessory_image" ADD CONSTRAINT "accessory_image_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accessory_product" ADD CONSTRAINT "accessory_product_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accessory_product" ADD CONSTRAINT "accessory_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote_accessory" ADD CONSTRAINT "quote_accessory_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quote_accessory" ADD CONSTRAINT "quote_accessory_accessory_id_accessory_id_fk" FOREIGN KEY ("accessory_id") REFERENCES "public"."accessory"("id") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zone_state" ADD CONSTRAINT "zone_state_zone_id_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zone"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zone_state" ADD CONSTRAINT "zone_state_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_webquote_emiplan" ON "emi_plan" USING btree ("webquote_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_webquote_fullpayment" ON "full_payment" USING btree ("webquote_id");