import { eq, sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { order, state, webQuote, zone, zoneState } from "../models/tables.js";

export class salesForceHooksService {
  static async webQuoteHandler(req, res) {
    try {
      const userAgent = req.headers["user-agent"];
      const isAllowed = userAgent.includes("SFDC-Callout");
      if (!isAllowed) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized Access!" });
      }
      const { action, new_records, old_records } = req.body;

      //  mapping between incoming field names and database column names
      const fieldMapping = {
        payment_type__c: "payment_type",
        contact_job_title__c: "contact_job_title",
        contact_industry__c: "contact_industry",
        contact_email__c: "contact_email",
        contact_phone_number__c: "contact_phone_number",
        contact_company_name__c: "contact_company_name",
        contact_first_name__c: "contact_first_name",
        billing_address_country__c: "billing_address_country",
        billing_address_zip_code__c: "billing_address_zip_code",
        billing_address_state__c: "billing_address_state",
        billing_address_city__c: "billing_address_city",
        delivery_address_country__c: "delivery_address_country",
        delivery_address_zip_code__c: "delivery_address_zip_code",
        delivery_address_state__c: "delivery_address_state_id",
        delivery_address_city__c: "delivery_address_city",
        delivery_cost__c: "delivery_cost",
        shipping_method_used__c: "shipping_method_used",
        product_qty__c: "product_qty",
        product_price__c: "product_price",
        product_name__c: "product_name",
        billing_address_street__c: "billing_address_street",
        delivery_address_street__c: "delivery_address_street",
        contact_last_name__c: "contact_last_name",
        financing__c: "financing",
        stage__c: "stage",
        product_total_cost__c: "product_total_cost",
        id: "sfIdRef",
      };

      if (action === "INSERT") {
        return res
          .status(200)
          .json({ success: true, message: "Inserted Data!" });
      }

      if (
        action === "UPDATE" &&
        new_records.length > 0 &&
        old_records.length > 0
      ) {
        const oldRecord = old_records[0];
        const newRecord = new_records[0];

        // Object to store updated fields
        const updatedFields = {};

        // loop the keys of the new record
        for (const key in newRecord) {
          // Check if the key exists in the old record and if the values differ
          if (
            oldRecord.hasOwnProperty(key) &&
            oldRecord[key] !== newRecord[key]
          ) {
            updatedFields[key] = newRecord[key];
          }
        }

        // Transform the updated fields to match the database column names
        const dbUpdateFields = {};
        for (const key in updatedFields) {
          if (fieldMapping[key]) {
            dbUpdateFields[fieldMapping[key]] = updatedFields[key];
          }
        }
        if (dbUpdateFields.hasOwnProperty("delivery_address_state_id")) {
          const [zoneRes] = await dbInstance
            .select()
            .from(state)
            .leftJoin(zoneState, eq(zoneState.state_id, state.id))
            .leftJoin(zone, eq(zone.id, zoneState.zone_id))
            .where(
              sql`${state.state_name} ILIKE ${
                "%" + dbUpdateFields.delivery_address_state_id + "%"
              }`
            );

          dbUpdateFields.delivery_address_state_id = zoneRes.state.id;
          dbUpdateFields.zone_id = zoneRes.zone.id;
          dbUpdateFields.delivery_cost = zoneRes.zone.shipping_rate;
        }

        // Perform database update using the transformed fields
        if (Object.keys(dbUpdateFields).length > 0) {
          await dbInstance
            .update(webQuote)
            .set(dbUpdateFields)
            .where(eq(webQuote.sfIdRef, newRecord.id))
            .returning();
        }
        return res
          .status(200)
          .json({ success: true, updatedFields: dbUpdateFields });
      }
      return res.status(200).json({ msg: "No updates detected!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  
  static async orderHandler(req, res) {
    try {
      const userAgent = req.headers["user-agent"];
      const isAllowed = userAgent.includes("SFDC-Callout");
      if (!isAllowed) {
        return res.status(401).json({ success: false, error: "Unauthorized Access!" });
      }
  
      const { action, new_records, old_records } = req.body;
  
      // mapping between incoming field names and database column names
      const fieldMapping = {
        order_status__c: "order_status",
        web_quote_id__c: "webquote_id",
        id: "sfIdRef",
      };
  
      if (action === "INSERT") {
        return res.status(200).json({ success: true, message: "Inserted Data!" });
      }
  
      if (action === "UPDATE" && new_records.length > 0 && old_records.length > 0) {
        const oldRecord = old_records[0];
        const newRecord = new_records[0];
  
        // Object to store updated fields
        const updatedFields = {};
  
        // loop keys of the new record
        for (const key in newRecord) {
          // Check if the key exists in the old record and if the values differ
          if (oldRecord.hasOwnProperty(key) && oldRecord[key] !== newRecord[key]) {
            updatedFields[key] = newRecord[key];
          }
        }
  
  
        // Transform the updated fields to match the database column names
        const dbUpdateFields = {};
        for (const key in updatedFields) {
          if (fieldMapping[key]) {
            dbUpdateFields[fieldMapping[key]] = updatedFields[key];
          }
        }
        
        
        
        if (dbUpdateFields.hasOwnProperty("order_status")) {
         if(dbUpdateFields.order_status=="Cancelled" || dbUpdateFields.order_status=="Delivered"){
          const completionDate = new Date();
          dbUpdateFields.actual_completion_date=completionDate
         }else{
          dbUpdateFields.actual_completion_date=null
         }
        }
  
  
        // Perform database update using the transformed fields
        if (Object.keys(dbUpdateFields).length > 0) {
          await dbInstance
            .update(order)
            .set(dbUpdateFields) 
            .where(eq(order?.sfIdRef, newRecord?.id)) 
            .returning();
        }
  
        return res.status(200).json({ success: true, updatedFields: dbUpdateFields });
      }
  
      return res.status(200).json({ msg: "No updates detected!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
    
}
