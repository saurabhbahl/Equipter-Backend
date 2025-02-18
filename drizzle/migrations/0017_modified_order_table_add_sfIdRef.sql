ALTER TABLE "order" ADD COLUMN "sfIdRef" text DEFAULT 'not-given';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_sfIdRef_index" ON "order" USING btree ("sfIdRef");