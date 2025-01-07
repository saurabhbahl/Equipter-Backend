ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_delivery_address_state_id_state_id_fk";
--> statement-breakpoint
ALTER TABLE "web_quote" ALTER COLUMN "delivery_address_state_id" SET DATA TYPE text;