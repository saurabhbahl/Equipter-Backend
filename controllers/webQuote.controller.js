
import { count, eq } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { quoteAccessory, webQuote } from "../models/tables.js";

export class webQuoteService {
  
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
      const accessories = Array.isArray(formData.accessories) ? formData.accessories : [];
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
      return res
        .status(201)
        .json({
          success: true,
          message:"WebQuoate created successfully!",
          data: { webQuote: createdQuote, accessories: quoteAccessoryRes },
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  

  static async getAllWebQuotesWithRelatedData(req, res) {
    try {
      // Pagination logic
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [webQuoteRes, totalCountRes = 1] = await Promise.all([
        dbInstance.select().from(webQuote).limit(limit).offset(offset),
        dbInstance.select({ count: count() }).from(webQuote),
      ]);

      const totalCount = totalCountRes[0].count;

      console.log(webQuoteRes);
      return res.status(200).json({
        success: true,
        length: webQuoteRes.length,
        totalCount: totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        data: webQuoteRes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
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
}