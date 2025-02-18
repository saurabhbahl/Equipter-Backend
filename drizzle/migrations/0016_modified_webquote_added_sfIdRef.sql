ALTER TABLE "web_quote" ADD COLUMN "sfIdRef" text DEFAULT 'not-given';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sfIdRef_index" ON "web_quote" USING btree ("sfIdRef");