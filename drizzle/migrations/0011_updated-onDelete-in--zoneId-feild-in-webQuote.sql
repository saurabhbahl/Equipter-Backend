ALTER TABLE "web_quote" DROP CONSTRAINT "web_quote_zone_id_zone_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_quote" ADD CONSTRAINT "web_quote_zone_id_zone_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zone"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
