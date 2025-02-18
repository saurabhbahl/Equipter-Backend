import Stripe from "stripe";
import {
  accessory,
  order,
  product,
  productImage,
  quoteAccessory,
  state,
  webQuote,
} from "../models/tables.js";
import jwt from "jsonwebtoken";
import { dbInstance } from "../config/dbConnection.cjs";
import { eq } from "drizzle-orm";
import { capitalize } from "../utils/helpers.js";
import { JWT_SECRET } from "../useENV.js";
import { SalesForceService } from "../services/salesForceService.js";
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
      const productImages = await dbInstance
        .select()
        .from(productImage)
        .where(eq(productImage.product_id, webQuoteRes.product.id));
      const featureImage =
        productImages.find((img) => img.is_featured == true) ||
        productImages[0];

      const deliveryStateRes = await dbInstance
        .select()
        .from(state)
        .where(eq(state.id, webQuoteRes.web_quote.delivery_address_state_id));

      // Fetch billing state information
      const billingStateRes = await dbInstance
        .select()
        .from(state)
        .where(eq(state.id, webQuoteRes.web_quote.billing_address_state));

      const stateRes = {
        deliveryState: deliveryStateRes[0] || null,
        billingState: billingStateRes[0] || null,
      };

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
 

      // Calculate total price (product + accessories)
      let totalPrice =
        Number(webQuoteRes.product.price) *
        Number(webQuoteRes.web_quote.product_qty);

      accessories.forEach((acc) => {
        totalPrice += Number(acc.total_price) * Number(acc.quantity);
      });

      // Fixed deposit amount
      const DEPOSIT_AMOUNT = 1500; // $1500 in dollars
      const depositInCents = DEPOSIT_AMOUNT * 100;
      let lineItems = [];

      const accessoriesList = accessories
        .map((acc) => {
          const name =
            acc.accessory_name.charAt(0).toUpperCase() +
            acc.accessory_name.slice(1).toLowerCase();
          return `• ${name} ($${acc.unit_price})`;
        })
        .join("\n");

      const remainingBalance = (Number(totalPrice) - DEPOSIT_AMOUNT).toFixed(2);

      // Use a multi-line template literal:
      const descriptionText = `
          Total Order Value: $${Number(totalPrice).toFixed(2)}
          Remaining Balance: $${remainingBalance}
        Accessories:${accessoriesList}`.trim();

      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Non Refundable Deposit for ${webQuoteRes.product.name.capitalize()}`,
            images: [featureImage.image_url],
            description:
              `Total Order Value: $${Number(totalPrice).toFixed(2)}\n` +
              `Remaining Balance: $${remainingBalance}\n` +
              `Accessories:${accessoriesList}`,
          },
          unit_amount: depositInCents,
        },
        quantity: 1,
      });

      //2. Add accessories with $0 amount to display them in checkout
      // accessories.forEach((acc) => {
      //   lineItems.push({
      //     price_data: {
      //       currency: currency.toLowerCase(),
      //       product_data: {
      //         name: `${acc.accessory_name.capitalize()} (Included in total)`,
      //         description: `Regular price: $${Number(acc.unit_price).toFixed(
      //           2
      //         )} each`,
      //       },
      //       unit_amount: 0, // No charge for accessories in deposit
      //     },
      //     quantity: acc.quantity,
      //   });
      // });

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


      // const coupon = await stripe.coupons.create({
      //   name: `Non Refundable Deposit (20% of ${deposit})`,
      //   percent_off: 80, // discount 80%
      //   duration: "once", // only applies one time
      //   redeem_by: Math.floor(Date.now() / 1000) + 60 * 60 * 1,
      // });
      // session
      
      const token = jwt.sign({ token: webQuoteId },JWT_SECRET, { expiresIn: '5m' });
    
      // Create the Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        metadata: {
          webQuoteId: webQuoteId,
        },
        // discounts: [{ coupon: coupon.id }],
        customer: customer.id,
        client_reference_id: customer.id,
        success_url: `${process.env.FRONTEND_URL}success?session_id=${token}`,
        cancel_url: `${process.env.FRONTEND_URL}products/${webQuoteRes.product.product_url}?webQuote=${webQuoteId}`,
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
        console.log("Payment succeeded for session:", session.id);
        await paymentService.fulfillOrder(session);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // response to acknowledge receipt of the event
    // res.json({  });
    res.status(200).json({success:true,message:"Order created successfully!",received: true})
  }
  static async fulfillOrder(session) {
    try {
      // get webquote id
      const webQuoteId = session.metadata.webQuoteId;
      if (!webQuoteId) {
        console.error("No webQuoteId found in session metadata.");
        return;
      }
      
    // update webquote stage
    const [webQuoteRes]=  await dbInstance
        .update(webQuote)
        .set({ stage: "Ordered" })
        .where(eq(webQuote.id, webQuoteId)).returning()
      
 
      
      
      // create salesforce order
      const sfService=new SalesForceService();
      const sfOrderData={
        Order_Status__c:"Pending",
        Web_Quote_Id__c:webQuoteRes?.sfIdRef,
        Name:webQuoteRes.product_name
      }
      const orderRes=await sfService.jsForceCreateOneRecordInObj("Product_Order__c",sfOrderData)
      

      
      // Calculate 3 months from now
      const estimatedCompletion = new Date();
      estimatedCompletion.setMonth(estimatedCompletion.getMonth() + 3);
      
      const [newOrder] = await dbInstance
        .insert(order)
        .values({
          sfIdRef:orderRes.id,
          webquote_id: webQuoteId,
          order_status: "Pending",
          estimated_completion_date: estimatedCompletion,
        })
        .returning();
      

      console.log(`Order ${webQuoteId} has been fulfilled.`, newOrder);
  
    } catch (err) {
      console.error("Order fulfillment failed:", err);
      throw err;
    }
  }
}
