import { connection } from "../config/dbConnection.cjs";

// Fetch all orders with their associated web_quote and related product using raw SQL query
export const fetchAllOrders = async (req, res) => {
  try {
    // Perform a raw SQL query fetching necessary columns
    const result = await connection.query(`
      SELECT o.*, wq.product_name AS webquote_product_name, p.name AS product_name, p.product_url AS product_url
      FROM "order" AS o
      INNER JOIN "web_quote" AS wq ON o.webquote_id = wq.id
      INNER JOIN "product" AS p ON wq.product_id = p.id
    `);

    // Restructure the data to include the nested web_quote and related product
    const ordersWithWebQuoteAndProduct = result.rows.map(row => {
      return {
        // Order fields
        id: row.id,
        webquote_id: row.webquote_id,
        order_status: row.order_status,
        estimated_completion_date: row.estimated_completion_date,
        actual_completion_date: row.actual_completion_date,
        created_at: row.created_at,
        updated_at: row.updated_at,

        // Nested web_quote with only product_name
        webquote: {
          product_name: row.webquote_product_name // Only include product_name
        },

        // Related product details
        product: {
          name: row.product_name,
          product_url: row.product_url,
        }
      };
    });

    // Send the response with the transformed data
    res.json({ success: true, data: ordersWithWebQuoteAndProduct });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
