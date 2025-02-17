import { count, eq, and, gte, like, sql, desc } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { product, quoteAccessory, webQuote, zone } from "../models/tables.js";
import { z } from "zod";
import { getDetailedErrors } from "../utils/validationUtil.js";
import {
  MAILER_EMAIL,
  MAILER_PASSWORD,
} from "../useENV.js";
import memoryCache from "memory-cache";
import nodemailer from "nodemailer";
import { SalesForceService } from "../services/salesForceService.js";
export class webQuoteService {
  static async getAllWebQuotesWithRelatedData(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        stage,
        financing,
        id,
        dateFilter,
      } = req.query;

      const pageInt = parseInt(page, 10) || 1;
      const limitInt = parseInt(limit, 10) || 10;
      const offset = (pageInt - 1) * limitInt;

      const whereClauses = [];

      if (stage) {
        whereClauses.push(eq(webQuote.stage, stage));
      }
      if (id) {
        whereClauses.push(sql`${webQuote.id}::text ILIKE ${`%${id}%`}`);
      }

      if (financing) {
        whereClauses.push(eq(webQuote.financing, financing));
      }
      if (dateFilter) {
        const days = parseInt(dateFilter, 10);
        console.log(days);
        if (!isNaN(days) && days > 0) {
          const dateThreshold = new Date();
          dateThreshold.setDate(dateThreshold.getDate() - days);
          whereClauses.push(gte(webQuote.created_at, dateThreshold));
        }
      }
      // quote_accessory: sql`COALESCE(
      //   JSON_AGG(DISTINCT row_to_json(${quoteAccessory}.*)), '[]'::jsonb
      // )`.as('quote_accessory')
      // let baseQuery = dbInstance.select().from(webQuote)
      // let baseQuery = dbInstance.select().from(webQuote).leftJoin(quoteAccessory,eq(webQuote.id,quoteAccessory.webquote_id));
      let baseQuery = dbInstance
        .select({
          ...webQuote,
          quote_accessory: sql`coalesce(json_agg(${quoteAccessory}.*), '[]'::json)`,
          product_url: product.product_url,
          zone_name: zone.zone_name,
        })
        .from(webQuote)
        .leftJoin(quoteAccessory, eq(webQuote.id, quoteAccessory.webquote_id))
        .leftJoin(product, eq(webQuote.product_id, product.id))
        .leftJoin(zone, eq(zone.id, webQuote.zone_id))
        .groupBy(webQuote.id, product.product_url, zone.zone_name);

      // web_quote
      let countQuery = dbInstance.select({ total: count() }).from(webQuote);

      if (whereClauses.length > 0) {
        baseQuery = baseQuery.where(and(...whereClauses));
        countQuery = countQuery.where(and(...whereClauses));
      }
      baseQuery = baseQuery
        .limit(limitInt)
        .offset(offset)
        .orderBy(desc(webQuote.created_at));

      const [webQuoteRes, totalCountRes] = await Promise.all([
        baseQuery,
        countQuery,
      ]);
      const totalCount = totalCountRes?.[0]?.total || 0;

      return res.status(200).json({
        success: true,
        length: webQuoteRes.length,
        totalCount,
        currentPage: pageInt,
        totalPages: Math.ceil(totalCount / limitInt),
        data: webQuoteRes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  static async getWebQuote(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing quote ID" });
      }
      const data = await dbInstance
        .select({
          ...webQuote,
          quote_accessory: sql`coalesce(json_agg(${quoteAccessory}.*), '[]'::json)`,
        })
        .from(webQuote)
        .leftJoin(quoteAccessory, eq(webQuote.id, quoteAccessory.webquote_id))
        .where(eq(webQuote.id, id))
        .groupBy(webQuote.id);

      if (!data.length) {
        return res
          .status(404)
          .json({ success: false, message: "Web Quote not found" });
      }
      return res.json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  static async createNewWebQuote(req, res) {
    try {
      // 1) Validate request body
      if (!req.body || !req.body.checkoutForm) {
        return res
          .status(400)
          .json({ success: false, error: "'checkoutForm' is required" });
      }

      // 2)  form data
      const formData = { ...req.body.checkoutForm, stage: "Quote" };

      // 3) Convert empty string to null
      if (formData.zone_id === "") {
        formData.zone_id = null;
      }

      // 4)  accessories array to handle them after quote creation
      const accessories = Array.isArray(formData.accessories)
        ? formData.accessories
        : [];
      // Remove 'accessories' from the main quote insert so it doesn’t break Drizzle's insert
      delete formData.accessories;

      // 5) Insert the main web quote
      // `returning()` resolves to an array of inserted rows, so destructure `[createdQuote]`
      const [createdQuote] = await dbInstance
        .insert(webQuote)
        .values(formData)
        .returning();

      // 6) If there are accessories,
      let quoteAccessoryRes = [];
      if (accessories.length > 0) {
        const accessoryPromises = accessories.map((acc) => {
          let data = {
            webquote_id: createdQuote.id,
            accessory_id: acc.id,
            accessory_name: acc.name,
            quantity: acc.qty,
            unit_price: Number(acc.price),
            total_price: Number(acc.price) * Number(acc.qty),
          };
          return dbInstance.insert(quoteAccessory).values(data).returning();
        });
        // Wait for all accessory inserts to complete
        quoteAccessoryRes = await Promise.all(accessoryPromises);
      }

      // 7) Return both the main quote and the newly inserted accessories
      return res.status(201).json({
        success: true,
        message: "WebQuoate created successfully!",
        data: { webQuote: createdQuote, accessories: quoteAccessoryRes },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  static async deleteSingleWebQuoteById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing quote ID" });
      }

      const webQuoteRes = await dbInstance
        .delete(webQuote)
        .where(eq(webQuote.id, id))
        .returning();

      console.log(webQuoteRes);
      return res.status(200).json({ success: true, data: webQuoteRes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  static async updateSingleWebQuoteById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing quote ID" });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request body" });
      }

      const webQuoteRes = await dbInstance
        .update(webQuote)
        .set(req.body)
        .where(eq(webQuote.id, id))
        .returning();

      console.log(webQuoteRes);
      return res.status(200).json({ success: true, data: webQuoteRes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  static async sendMail(req, res) {
    const validation = z.object({
      email: z.string().email("Invalid email format"),
      secondary_email: z
        .string()
        .email({ message: "Invalid email address." })
        .optional()
        .or(z.literal("")),
      webQuote_url: z.string(),
      product_name: z.string().min(1, "product name is required"),
    });

    const parsedData = validation.safeParse(req.body);
    if (!parsedData.success) {
      const errorDetails = await getDetailedErrors(parsedData);
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errorDetails,
      });
    }

    const { email, secondary_email, webQuote_url, product_name } =
      parsedData.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: MAILER_EMAIL,
        pass: MAILER_PASSWORD,
      },
    });

    // Define the common email content
    const emailContent = `
      <div style="font-family: 'Work Sans', sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #f5f5f5;">
        <h1 style="color: #ea7600; text-align: center; font-size: 32px; margin-bottom: 20px;">Equipter Product - ${product_name}</h1>
        <p style="color: #444; font-size: 17px;"><a href="${webQuote_url}">Here</a> is your build configuration. Click and check your build</p>
        <a href="${webQuote_url}">${webQuote_url}</a>
        <p style="color: #444; font-size: 17px;">Thank you!</p>
      </div>
    `;

    // Send the primary email
    const mailOptionsPrimary = {
      from: MAILER_EMAIL,
      to: email,
      subject: `Equipter Product - ${product_name}`,
      html: emailContent,
    };

    // Send to the primary email address first
    transporter.sendMail(mailOptionsPrimary, (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message, success: false });
      }

      // If a secondary email is provided, send a separate email to it
      if (secondary_email) {
        const mailOptionsSecondary = {
          from: MAILER_EMAIL,
          to: secondary_email,
          subject: `Equipter Product - ${product_name}`,
          html: emailContent,
        };

        // Send the email to the secondary email
        transporter.sendMail(mailOptionsSecondary, (err2, info2) => {
          if (err2) {
            return res
              .status(500)
              .json({ message: err2.message, success: false });
          }
          res.status(200).json({
            message: "Web Quote link sent to both emails.",
            success: true,
          });
        });
      } else {
        // If no secondary email, just return success for the primary email
        return res
          .status(200)
          .json({ message: "Web Quote link sent.", success: true });
      }
    });
  }
  static async createQuoteAccessory(req, res) {
    try {
      const data = req.body?.quoteAccessoiesData;

      if (!data) {
        return res
          .status(400)
          .json({ success: false, message: "No data provided." });
      }
      console.log(data);

      // Determine if the incoming data is an array or a single object
      const isArray = Array.isArray(data);
      const accessories = isArray ? data : [data];

      // Validate each accessory object
      for (const accessory of accessories) {
        const {
          webquote_id,
          accessory_id,
          accessory_name,
          quantity,
          unit_price,
          total_price,
        } = accessory;
        if (!webquote_id || !accessory_id || !accessory_name) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields in one or more accessories.",
          });
        }

        if (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid quantity for one or more accessories.",
          });
        }
        if (isNaN(parseFloat(unit_price)) || parseFloat(unit_price) < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid unit price for one or more accessories.",
          });
        }
        if (isNaN(parseFloat(total_price)) || parseFloat(total_price) < 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid total price for one or more accessories.",
          });
        }
      }

      const insertValues = accessories.map((acc) => ({
        webquote_id: acc.webquote_id,
        accessory_id: acc.accessory_id,
        accessory_name: acc.accessory_name,
        quantity: parseInt(acc.quantity, 10) || 1,
        unit_price: parseFloat(acc.unit_price),
        total_price: parseFloat(acc.total_price),
      }));
      console.log("insertValues=>", insertValues);

      const createdAccessories = await dbInstance
        .insert(quoteAccessory)
        .values(insertValues)
        .returning();

      return res.status(201).json({
        success: true,
        data: isArray ? createdAccessories : createdAccessories[0],
      });
    } catch (error) {
      console.error("Error creating quote accessories:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error." });
    }
  }
  static async firstPageForm(req, res) {
    try {      
      const sfService = new SalesForceService();    
      if((!req.body.fName)||(!req.body.lName)||(!req.body.company)||(!req.body.phNo)||(!req.body.email)||(!req.body.jobTitle)||(!req.body.state)||(!req.body.industry)){
        return res.status(403).json({success:false,message:"All fields are required!"})
      }
 
      const data = {
        Name: req.body.fName||"--",
        Last_Name__c: req.body.lName||"--",
        Company__c: req.body.company||"--",
        Phone_Number__c: req.body.phNo||"--",
        Email__c: req.body.email||"noemail@given.com",
        Job_Title__c: req.body.jobTitle||"--",
        State__c: req.body.state||"--",
        Industry__c: req.body.industry||"--",
      };
      const searchCondition={
        Phone_Number__c: req.body.phNo||"--",
        Email__c: req.body.email||"noemail@given.com", 
        State__c: req.body.state||"--", 
      }
      const exitsingRecord=await sfService.jsForceFindOne("FirstPageForm__c",searchCondition)
      if(exitsingRecord){
        return res.status(403).json({message:"Duplicate Entry!"})
      }
      await sfService.jsForceCreateOneRecordInObj("FirstPageForm__c",data)
      return res.status(201).json({ success:true,message: "Lead Created" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error." });
    }
  }
}
