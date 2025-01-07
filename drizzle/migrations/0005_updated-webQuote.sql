-- drizzle\migrations\0005_updated-webQuote.sql

-- 1) Safely drop old constraints if they exist
ALTER TABLE "web_quote" 
  DROP CONSTRAINT IF EXISTS "web_quote_webquote_url_unique",
  DROP CONSTRAINT IF EXISTS "web_quote_shipping_method_id_shipping_method_id_fk";

-- 2) Update the default value of "stage"
ALTER TABLE "web_quote" 
  ALTER COLUMN "stage" SET DEFAULT 'Quote';

-- 3) Add new column "shipping_method_used" of type "shippingmethodtype" with default value
ALTER TABLE "web_quote" 
  ADD COLUMN IF NOT EXISTS "shipping_method_used" "shippingmethodtype" DEFAULT 'pickup';

-- 4) Remove old/unused columns if they exist
ALTER TABLE "web_quote" 
  DROP COLUMN IF EXISTS "webquote_url",
  DROP COLUMN IF EXISTS "shipping_method_id",
  DROP COLUMN IF EXISTS "estimated_delivery_date",
  DROP COLUMN IF EXISTS "pickup_location_name",
  DROP COLUMN IF EXISTS "pickup_location_address",
  DROP COLUMN IF EXISTS "pickup_scheduled_date";
