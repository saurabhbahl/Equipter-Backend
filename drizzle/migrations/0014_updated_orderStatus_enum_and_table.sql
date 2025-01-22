DO $$ BEGIN
 CREATE TYPE "public"."orderStatus" AS ENUM('Pending', 'Approved', 'Delivered', 'Shipped', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- drop the column 
ALTER TABLE "order" DROP COLUMN "order_status";
-- create column
ALTER TABLE "order" ADD COLUMN order_status "orderStatus"