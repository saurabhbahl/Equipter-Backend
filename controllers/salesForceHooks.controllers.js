import { and, eq, sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import {
  order,
  product,
  state,
  webQuote,
  zone,
  zoneState,
} from "../models/tables.js";
import { SalesForceService } from "../services/salesForceService.js";
import { FRONTEND_URL } from "../useENV.js";

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
   
      const sfService=new SalesForceService()
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
        const newRecord = new_records[0];
        const [webExists]=await dbInstance.select().from(webQuote).where(eq(webQuote.sfIdRef,newRecord.id))
        if(webExists){
          return res.status(200).json({success:true,message:"Duplicate entry!"})
        }

        let webQuoteurl
        //  match the database schema
        const dbInsertFields = {};
        for (const key in newRecord) {
          if (fieldMapping[key]) {
            dbInsertFields[fieldMapping[key]] = newRecord[key];
          }
        }

        // Handle delivery_address_state_id mapping to zone and state
        if (dbInsertFields.delivery_address_state_id) {
          const [zoneRes] = await dbInstance
            .select()
            .from(state)
            .leftJoin(zoneState, eq(zoneState.state_id, state.id))
            .leftJoin(zone, eq(zone.id, zoneState.zone_id))
            .where(
              sql`${state.state_name} ILIKE ${
                "%" + dbInsertFields.delivery_address_state_id + "%"
              }`
            );

          if (zoneRes) {
            dbInsertFields.delivery_address_state_id = zoneRes.state.id;
            dbInsertFields.zone_id = zoneRes.zone.id;
            dbInsertFields.delivery_cost = zoneRes.zone.shipping_rate;
          } else {
            console.warn(
              "No matching state or zone found for delivery_address_state_id."
            );
          }
        }

        // Find the product_id based on the product_name
        if (dbInsertFields.product_name) {
          const [productRes] = await dbInstance
            .select()
            .from(product)            
            .where(sql`${product.name} ILIKE ${
              "%" +  dbInsertFields.product_name + "%"
            }`);
          if (productRes) {
            webQuoteurl = `${FRONTEND_URL}products/${productRes.product_url}`;
            dbInsertFields.product_id = productRes.id;
          } else {
            console.warn(
              `No product found with name: ${dbInsertFields.product_name}`
            );
          }
        }

        console.log("dbInsertFields", dbInsertFields);
        //  new webQuote record into the database
        const [insertedWebquote] = await dbInstance
          .insert(webQuote)
          .values(dbInsertFields)
          .returning();
          webQuoteurl = webQuoteurl +`?webQuote=${insertedWebquote.id}`
   
    
        
        
        const sfWebQuoteRes=await sfService.jsForceUpdateOneRecordInObj("Web_Quote__c",{Id:newRecord.id,Webquote_Url__C:webQuoteurl})
        console.log(sfWebQuoteRes)
        

        return res.status(201).json({
          success: true,
          message: "WebQuote Created Successfully!",
        });
      }

      if (action === "DELETE") {
        const oldRecord = old_records[0];
        await dbInstance
          .delete(webQuote)
          .where(eq(webQuote.sfIdRef, oldRecord.id));
        return res
          .status(200)
          .json({ success: true, message: "Order Deleted!" });
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
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized Access!" });
      }

      const { action, new_records, old_records } = req.body;
      console.log(req.body)
      const sfService=new SalesForceService()
      // mapping between incoming field names and database column names
      const fieldMapping = {
        order_status__c: "order_status",
        web_quote_id__c: "webquote_id",
        id: "sfIdRef",
      };

      if (action === "INSERT") {
        const newRecord = new_records[0];
        const [orderExists]=await dbInstance.select().from(order).where(eq(order.sfIdRef,newRecord.id))
        //  update sf webquote stage
         const sfWebQuoteData={
           Id:newRecord.web_quote_id__c,
           Stage__c:"Ordered"

         }
      const sfWebQuoteRes=await sfService.jsForceUpdateOneRecordInObj("Web_Quote__c",sfWebQuoteData)
      console.log(sfWebQuoteRes)
        if(orderExists){
          console.log("order already exits")
          return res.status(200).json({success:true,message:"Duplicate entry!"})
        }
     
        // Transform the incoming fields to match the database schema
        const dbInsertFields = {};
        for (const key in newRecord) {
          if (fieldMapping[key]) {
            dbInsertFields[fieldMapping[key]] = newRecord[key];
          }
        }

        console.log("dbInsertFields", dbInsertFields);

        // Validate and fetch the webquote_id
        if (dbInsertFields.webquote_id) {
          const [webQuoteRes] = await dbInstance
            .select({ id: webQuote.id })
            .from(webQuote)
            .where(eq(webQuote.sfIdRef, dbInsertFields.webquote_id));

          if (!webQuoteRes) {
            // Fetch the missing webQuote from Salesforce
            const sfService = new SalesForceService();
            const searchCondition = {
              Id: dbInsertFields.webquote_id,
            };

            const salesforceWebQuote = await sfService.jsForceFindOne(
              "Web_Quote__c",
              searchCondition
            );

            if (!salesforceWebQuote) {
              console.log(
                `No webQuote found in Salesforce with Id: ${dbInsertFields.webquote_id}`
              );
              return res.status(400).json({
                success: false,
                error: `Invalid web_quote_id__c: ${dbInsertFields.webquote_id}`,
              });
            }

            console.log(
              "Fetched WebQuote from Salesforce:",
              salesforceWebQuote
            );

            const webQuoteFieldMapping = {
              Payment_Type__c: "payment_type",
              Contact_Job_TItle__c: "contact_job_title",
              Contact_Industry__c: "contact_industry",
              Contact_Email__c: "contact_email",
              Contact_Phone_Number__c: "contact_phone_number",
              Contact_Company_Name__c: "contact_company_name",
              Contact_First_Name__c: "contact_first_name",
              Billing_Address_Country__c: "billing_address_country",
              Billing_Address_Zip_Code__c: "billing_address_zip_code",
              Billing_Address_State__c: "billing_address_state",
              Billing_Address_City__c: "billing_address_city",
              Delivery_Address_Country__c: "delivery_address_country",
              Delivery_Address_Zip_Code__c: "delivery_address_zip_code",
              Delivery_Address_State__c: "delivery_address_state_id",
              Delivery_Address_City__c: "delivery_address_city",
              Delivery_Cost__c: "delivery_cost",
              Shipping_Method_Used__c: "shipping_method_used",
              Product_Qty__c: "product_qty",
              Product_Price__c: "product_price",
              Product_Name__c: "product_name",
              Billing_Address_Street__c: "billing_address_street",
              Delivery_Address_Street__c: "delivery_address_street",
              Contact_Last_Name__c: "contact_last_name",
              Financing__c: "financing",
              Stage__c: "stage",
              Product_Total_Cost__c: "product_total_cost",
              Id: "sfIdRef",
            };

            const dbWebQuoteFields = {};
            for (const key in salesforceWebQuote) {
              if (webQuoteFieldMapping[key]) {
                dbWebQuoteFields[webQuoteFieldMapping[key]] =
                  salesforceWebQuote[key];
              }
            }

            // Handle delivery_address_state_id mapping to zone and state
            if (dbWebQuoteFields.delivery_address_state_id) {
              const [zoneRes] = await dbInstance
                .select()
                .from(state)
                .leftJoin(zoneState, eq(zoneState.state_id, state.id))
                .leftJoin(zone, eq(zone.id, zoneState.zone_id))
                .where(
                  sql`${state.state_name} ILIKE ${
                    "%" + dbWebQuoteFields.delivery_address_state_id + "%"
                  }`
                );

              if (zoneRes) {
                dbWebQuoteFields.delivery_address_state_id = zoneRes.state.id;
                dbWebQuoteFields.zone_id = zoneRes.zone.id;
                dbWebQuoteFields.delivery_cost = zoneRes.zone.shipping_rate;
              } else {
                console.warn(
                  "No matching state or zone found for delivery_address_state_id."
                );
              }
            }
            dbWebQuoteFields.i_understand_deposit_is_non_refundable = true;
            console.log("dbWebQuoteFields", dbWebQuoteFields);

            const [productRes] = await dbInstance
              .select()
              .from(product)
              .where(
                sql`${product.name} ILIKE ${
                  "%" + dbWebQuoteFields.product_name + "%"
                }`
              );
              console.log("productRes",productRes)
            if (productRes) {
              dbWebQuoteFields.product_id = productRes.id;
            }

            // Insert the fetched webQuote into the database
            const [insertedWebQuote] = await dbInstance
              .insert(webQuote)
              .values(dbWebQuoteFields)
              .returning();

            console.log("Inserted WebQuote Record:", insertedWebQuote);

            // Use the newly created webQuote's ID
            dbInsertFields.webquote_id = insertedWebQuote.id;
          } else {
            // Use the existing webQuote's ID
            dbInsertFields.webquote_id = webQuoteRes.id;
          }
        } else {
          console.warn("web_quote_id__c is missing in the request.");
          return res.status(400).json({
            success: false,
            error: "Missing required field: web_quote_id__c",
          });
        }

        // Set default values for estimated_completion_date
        const estimatedCompletionDate = new Date();
        estimatedCompletionDate.setMonth(
          estimatedCompletionDate.getMonth() + 3
        );
        dbInsertFields.estimated_completion_date = estimatedCompletionDate;

        // Insert the new order record into the database
        const [insertedOrder] = await dbInstance
          .insert(order)
          .values(dbInsertFields)
          .returning();

        console.log("Inserted Order Record:", insertedOrder);

        return res.status(200).json({
          success: true,
          message: "Order Created Successfully!",
          data: insertedOrder,
        });
      }

      if (action === "DELETE") {
        const oldRecord = old_records[0];
        await dbInstance.delete(order).where(eq(order.sfIdRef, oldRecord.id));
        return res
          .status(200)
          .json({ success: true, message: "Order Deleted!" });
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

        // loop keys of the new record
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

        if (dbUpdateFields.hasOwnProperty("order_status")) {
          if (
            dbUpdateFields.order_status == "Cancelled" ||
            dbUpdateFields.order_status == "Delivered"
          ) {
            const completionDate = new Date();
            dbUpdateFields.actual_completion_date = completionDate;
          } else {
            dbUpdateFields.actual_completion_date = null;
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
}
