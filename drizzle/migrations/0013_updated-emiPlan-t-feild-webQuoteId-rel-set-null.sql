ALTER TABLE "emi_plan" DROP CONSTRAINT "emi_plan_webquote_id_web_quote_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emi_plan" ADD CONSTRAINT "emi_plan_webquote_id_web_quote_id_fk" FOREIGN KEY ("webquote_id") REFERENCES "public"."web_quote"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
