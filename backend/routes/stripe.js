const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

// Middleware to parse raw request body
router.use(
  express.json({
    verify: (req, res, buffer) => {
      req.rawBody = buffer.toString();
    },
  })
);

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.url],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

// Create order function
const createOrder = async (customer, data, lineItems) => {
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: lineItems.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save(); // Ensure to use 'await' here
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// Stripe webhook
router.post("/webhook", async(req, res) => {
  let data;
  let eventType;

  //const webhookSecret = process.env.STRIPE_WEB_HOOK;
  const endpointSecret = "whsec_db19e26e9b94e1eecad16224322678462431a3dc7edaf9f618c038c039980fa7";

  const signature = req.headers['stripe-signature'];
  
  if (endpointSecret===signature) {
    let event;
    //const signature = req.headers['stripe-signature'];
    //const signature = req.get('stripe-signature');
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed: ${err}`);
      return res.sendStatus(500);
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    try {
      const customer = await stripe.customers.retrieve(data.customer);
      const lineItems = await stripe.checkout.sessions.listLineItems(data.id, {});

      createOrder(customer, data, lineItems);
    } catch (err) {
      console.log(err.message);
    }
  }
  res.sendStatus(200).end();
});

module.exports = router;
