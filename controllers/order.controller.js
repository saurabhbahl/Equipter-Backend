import { connection } from "../config/dbConnection.cjs";
import { and, count, desc, eq, gte, ilike, like, sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { order, webQuote, product } from "../models/tables.js";

export class OrderService {
  static async fetchAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        order_status,
        product_name,
        duration,
        order_id
      } = req.query;

      const pageInt = parseInt(page, 10) || 1;
      const limitInt = parseInt(limit, 10) || 10;
      const offset = (pageInt - 1) * limitInt;

  
      const whereClauses = [];    
      if (order_status) {
        whereClauses.push(eq(order.order_status, order_status));
      }
      if (order_id) {
        whereClauses.push(
          sql`${order.id}::text ILIKE ${`%${order_id}%`}`
        ); 
      }

      if (product_name) {
        whereClauses.push(ilike(product.name, `%${product_name}%`));
      }
      
      if (duration) {
        const days = parseInt(duration, 10);
        console.log(days)
        if (!isNaN(days) && days > 0) {
          const dateThreshold = new Date();
          dateThreshold.setDate(dateThreshold.getDate() - days);
          console.log(dateThreshold)
          whereClauses.push(gte(order.created_at, dateThreshold));
        }
      }

      // --- Base SELECT Query ---
      let baseQuery = dbInstance
        .select({
          id: order.id,
          webquote_id: order.webquote_id,
          order_status: order.order_status,
          estimated_completion_date: order.estimated_completion_date,
          actual_completion_date: order.actual_completion_date,
          created_at: order.created_at,
          updated_at: order.updated_at,
          // WebQuote columns         
          webquote: {
            product_name: webQuote.product_name,
            state_id:webQuote.delivery_address_state_id,         
          },
          //product columns
          product: {
            product_id:product.id,
            name: product.name,
            product_url: product.product_url,
            product_price:product.price,
            product_qty:webQuote.product_qty,
            product_total_cost:webQuote.product_total_cost
          },      
        })
        .from(order)
        .innerJoin(webQuote, eq(order.webquote_id, webQuote.id))
        .innerJoin(product, eq(webQuote.product_id, product.id));


      let countQuery = dbInstance
        .select({
          total: count(), 
        })
        .from(order)
        .innerJoin(webQuote, eq(order.webquote_id, webQuote.id))
        .innerJoin(product, eq(webQuote.product_id, product.id));


      if (whereClauses.length > 0) {
        baseQuery = baseQuery.where(and(...whereClauses));
        countQuery = countQuery.where(and(...whereClauses));
      }

      // --- Add ORDER BY, LIMIT, OFFSET to the main query ---
      baseQuery = baseQuery.orderBy(desc(order.created_at)).limit(limitInt).offset(offset);

      // --- Execute both queries in parallel ---
      const [orderRes, totalCountResult] = await Promise.all([baseQuery, countQuery]);

      // Extract total count from the count query
      const totalCount = totalCountResult[0]?.total ?? 0;
      const totalPages = Math.ceil(totalCount / limitInt);


      return res.status(200).json({
        success: true,
        length: orderRes.length,
        totalCount,
        currentPage: pageInt,
        totalPages,
        data: orderRes,
      });
    } catch (error) {
      console.error("Error in fetchAllOrders:", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
}
