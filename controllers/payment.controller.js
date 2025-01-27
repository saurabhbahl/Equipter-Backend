import Stripe from "stripe";
import {
  accessory,
  product,
  quoteAccessory,
  state,
  webQuote,
} from "../models/tables.js";
import { dbInstance } from "../config/dbConnection.cjs";
import { eq } from "drizzle-orm";
import { capitalize } from "../utils/helpers.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export class paymentService {
  static async makePayment(req, res) {
    try {
      const { amount, currency, paymentMethodId } = req.body;

      if (!amount || !currency || !paymentMethodId) {
        return res.status(400).json({
          success: false,
          message: "Missing required payment information.",
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: "https://your-frontend-url.com/return",
        receipt_email: "excitingishizaka@fearlessmails.com",
      });

      // await paymentService.createInvoiceAndSendEmail(req,res)
      return res.status(200).json({
        success: true,
        paymentIntent,
      });
    } catch (error) {
      console.error("Stripe Payment Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createInvoiceAndSendEmail(req, res) {
    const {
      customerEmail = "excitingishizaka@fearlessmails.com",
      amount,
      currency,
    } = req.body;

    const customer = await stripe.customers.create({
      email: customerEmail,
    });

    // Create an invoice item
    await stripe.invoiceItems.create({
      customer: customer.id,
      amount: amount * 100, // amount in cents
      currency: currency,
      description: "Payment for services",
    });

    // Create an invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true,
    });

    // Send the invoice to the customer
    await stripe.invoices.sendInvoice(invoice.id);

    return res.status(200).json({
      success: true,
      message: "Invoice created and sent successfully",
      invoice,
    });
  }

  static async createCheckoutSession(req, res) {
    try {
      const { webQuoteId, currency = "usd" } = req.body;
      console.log("CHECKOUT SESSION:", webQuoteId, currency);

      if (!webQuoteId || !currency) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: webQuoteId, currency",
        });
      }

      // Fetch the webQuote
      const [webQuoteRes] = await dbInstance
        .select()
        .from(webQuote)
        .where(eq(webQuote.id, webQuoteId))
        .leftJoin(quoteAccessory, eq(quoteAccessory.webquote_id, webQuoteId))
        .rightJoin(product, eq(product.id, webQuote.product_id));

      if (!webQuoteRes) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
      console.log("webQuoteRes:", webQuoteRes);
 

      const deliveryStateRes = await dbInstance
      .select()
      .from(state)
      .where(eq(state.id, webQuoteRes.web_quote.delivery_address_state_id))
    
    // Fetch billing state information
    const billingStateRes = await dbInstance
      .select()
      .from(state)
      .where(eq(state.id, webQuoteRes.web_quote.billing_address_state))
    
    const stateRes = {
      deliveryState: deliveryStateRes[0]||null,
      billingState: billingStateRes[0] || null,
    };
      console.log("stateRes", stateRes);

      // Fetch accessories
      const accessories = await dbInstance
        .select({
          id: quoteAccessory.id,
          webquote_id: quoteAccessory.webquote_id,
          accessory_id: quoteAccessory.accessory_id,
          quantity: quoteAccessory.quantity,
          unit_price: accessory.price,
          accessory_name: quoteAccessory.accessory_name,
          total_price: quoteAccessory.total_price,
        })
        .from(quoteAccessory)
        .where(eq(quoteAccessory.webquote_id, webQuoteId))
        .leftJoin(accessory, eq(accessory.id, quoteAccessory.accessory_id));
      console.log("accessories", accessories);

      // Calculate total price (product + accessories)
      let totalPrice =
        Number(webQuoteRes.product.price) *
        Number(webQuoteRes.web_quote.product_qty);

      accessories.forEach((acc) => {
        totalPrice += Number(acc.total_price) * Number(acc.quantity);
      });
      // Calculate deposit (20% of total price)
      let deposit = Math.ceil(totalPrice);
      console.log("Deposit", deposit);
      // Construct line_items
      const lineItems = [];

      // Main product
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Non-Refundable Deposit for ${webQuoteRes.product.name.capitalize()}`,
            description: `Product ID: ${webQuoteRes.product.id}`,
          },
          unit_amount: deposit * 100,
        },
        quantity: webQuoteRes.web_quote.product_qty,
      });

      //List Accessories Selected but dont add there price just deposit amount that is already calculated
      for (const acc of accessories) {
        const unitAmount = Math.round(Number(acc.unit_price)); // price in cents

        const quantity = Number(acc.quantity);

        lineItems.push({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: acc.accessory_name.capitalize(),
              description: `Accessory ID: ${acc.accessory_id} — ($${unitAmount})`,
            },
            unit_amount: unitAmount * 100,
          },
          quantity: quantity,
        });
      }

      console.log(
        "Line Items:",
        lineItems,
        deposit,
        webQuoteRes.web_quote.non_refundable_deposit
      );

      let customer;
      let email = webQuoteRes.web_quote.contact_email;
      let name =
        webQuoteRes.web_quote.contact_first_name +
        webQuoteRes.web_quote.contact_last_name;
      const customers = await stripe.customers.search({
        query: `email:'${webQuoteRes.web_quote.contact_email}'`,
      });

      if (customers.data.length > 0) {
        // Customer exists
        customer = customers.data[0];
        console.log("sCus", customer);
      } else {
        // Customer does not exist, create a new one
        customer = await stripe.customers.create({
          email,
          name,
          phone: webQuoteRes.web_quote.contact_phone_number,
          address: {
            line1: webQuoteRes.web_quote.billing_address_street,
            city: webQuoteRes.web_quote.billing_address_city,
            state: stateRes.billingState.state_name,
            postal_code: webQuoteRes.web_quote.billing_address_zip_code,
            country: "US",
          },
        });
      }
      console.log("Cus", customer);

      const coupon = await stripe.coupons.create({
        name: `Non Refundable Deposit (20% of ${deposit})`,
        percent_off: 80, // discount 80%
        duration: "once", // only applies one time
        redeem_by: Math.floor(Date.now() / 1000) + 60 * 60 * 1,
      });

      // Create the Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // customer_update: {},
        line_items: lineItems,
        mode: "payment",
        discounts: [{ coupon: coupon.id }],
        customer:customer.id,
        client_reference_id: customer.id,
        success_url: `${process.env.FRONTEND_URL}success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}cancel`,
      });
      return res.status(200).json({
        success: true,
        sessionUrl: session.url,
      });
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create checkout session.",
      });
    }
  }

  static async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout Session completed:", session);
        // Fulfill the purchase, e.g., update order status in DB
        await paymentService.fulfillOrder(session);
        // Optionally, send custom confirmation email
        await sendPaymentConfirmation(
          session.customer_email,
          session.amount_total / 100,
          session.currency
        );
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }

  /**
   * Fulfill Order: Update order status in the database
   */
  static async fulfillOrder(session) {
    const webQuoteId = session.metadata.webQuoteId;
    if (!webQuoteId) {
      console.error("No webQuoteId found in session metadata.");
      return;
    }

    // Update the webQuote in the database to mark it as paid
    await dbInstance
      .update(webQuote)
      .set({ status: "paid" }) // Adjust based on your schema
      .where(eq(webQuote.id, webQuoteId));

    console.log(`Order ${webQuoteId} has been fulfilled.`);
  }
}
