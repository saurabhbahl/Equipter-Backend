ALTER TABLE "development_stage" DROP CONSTRAINT "development_stage_product_order_id_order_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_stage" ADD CONSTRAINT "development_stage_product_order_id_order_id_fk" FOREIGN KEY ("product_order_id") REFERENCES "public"."order"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
