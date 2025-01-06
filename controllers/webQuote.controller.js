// import { eq } from "drizzle-orm";
// import { dbInstance } from "../config/dbConnection.cjs";
// import { webQuote } from "../models/tables.js";

// export class webQuoteService {
//   static async createNewWebQuote(req, res) {
//     try {

//       if (!req.body) {
//         return res.status(400).json({ success: false, error: "Invalid request body" });
//       }

//       const webQuoteRes = await dbInstance
//         .insert(webQuote)
//         .values(req.body)
//         .returning();

//       console.log(webQuoteRes);
//       return res.json({ webQuoteRes });
//     } catch (error) {
//       console.error(error); // Log the error for debugging
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }

//   static async getAllWebQuotesWithRelatedData(req, res) {
//     try {
//       const webQuoteRes = await dbInstance.select().from(webQuote);

//       console.log(webQuoteRes);
//       return res.status(200).json({success:true,length:webQuoteRes.length,data: webQuoteRes });
//     } catch (error) {
//       console.error(error); // Log the error for debugging
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }

//   static async deleteSingleWebQuoteById(req, res) {
//     try {
//       const { id } = req.params;
//       if (!id) {
//         return res.status(400).json({ success: false, error: "Missing quote ID" });
//       }

//       const webQuoteRes = await dbInstance
//         .delete(webQuote)       
//         .where(eq(webQuote.id, id))
//         .returning();

//       console.log(webQuoteRes);
//       return res.json({ webQuoteRes });
//     } catch (error) {
//       console.error(error); // Log the error for debugging
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }

//   static async updateSingleWebQuoteById(req, res) {
//     try {
//       const { id } = req.params;
//       if (!id) {
//         return res.status(400).json({ success: false, error: "Missing quote ID" });
//       }

//       if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).json({ success: false, error: "Invalid request body" });
//       }

//       const webQuoteRes = await dbInstance
//         .update(webQuote)
//         .set(req.body)
//         .where(eq(webQuote.id, id))
//         .returning();

//       console.log(webQuoteRes);
//       return res.json({ webQuoteRes });
//     } catch (error) {
//       console.error(error); 
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// }



import { count, eq } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { webQuote } from "../models/tables.js";

export class webQuoteService {
  static async createNewWebQuote(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ success: false, error: "Invalid request body" });
      }

      const webQuoteRes = await dbInstance
        .insert(webQuote)
        .values(req.body)
        .returning();

      console.log(webQuoteRes);
      return res.status(201).json({ success: true, data: webQuoteRes });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllWebQuotesWithRelatedData(req, res) {
    try {
      // Pagination logic
      const { page = 1, limit = 2 } = req.query; 
      const offset = (page - 1) * limit;

      const [webQuoteRes, totalCountRes=1] = await Promise.all([
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
        return res.status(400).json({ success: false, error: "Missing quote ID" });
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
        return res.status(400).json({ success: false, error: "Missing quote ID" });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, error: "Invalid request body" });
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
