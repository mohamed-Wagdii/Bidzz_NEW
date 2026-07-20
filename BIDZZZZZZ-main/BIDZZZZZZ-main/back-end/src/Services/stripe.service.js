import { getStripe } from "./stripe.js";

// Create a Stripe PaymentIntent for an order
export const createStripePaymentIntent = async (order) => {
  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.finalPrice * 100), // Stripe uses cents
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
};

// Verify and construct a Stripe webhook event
export const constructStripeEvent = (rawBody, sig) => {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};
