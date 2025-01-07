ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_product_id_product_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_zone_id_zone_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_delivery_address_state_id_state_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "stage";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "financing";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "product_id";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "product_name";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "product_price";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "product_qty";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "shipping_method_used";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "zone_id";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_first_name";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_last_name";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_company_name";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_phone_number";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_email";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_industry";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "contact_job_title";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_same_as_delivery";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_address_street";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_address_city";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_address_state";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_address_zip_code";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "billing_address_country";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_cost";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_address_street";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_address_city";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_address_state_id";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_address_zip_code";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "delivery_address_country";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "payment_type";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "product_total_cost";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "non_refundable_deposit";--> statement-breakpoint
ALTER TABLE "web_quote" DROP COLUMN IF EXISTS "i_understand_deposit_is_non_refundable";