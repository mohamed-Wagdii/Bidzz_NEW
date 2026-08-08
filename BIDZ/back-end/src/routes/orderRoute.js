import express from "express";
import { createOrder, paymentSuccess, paymentCancel, updateShipping, updateOrderStatus, payWithWallet } from "../controller/orderController.js";
import { getDeliveryData, verifyDeliveryQr } from "../controller/deliveryController.js";
import { createStripePaymentIntent, constructStripeEvent } from "../Services/stripe.service.js";
import { createStammpPayment, verifyStammpCallback } from "../Services/stammp.service.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * POST /create/:auctionId
 * Creates an order after an auction is won.
 */
router.post("/create/:auctionId", authMiddleware, createOrder);

/**
 * POST /:id/pay
 * Processes order payment using the user's wallet balance.
 */
router.post("/:id/pay", authMiddleware, payWithWallet);

/**
 * GET /success
 * Redirect URL for successful payments.
 */
router.get("/success", paymentSuccess);

/**
 * GET /cancel
 * Redirect URL for cancelled payments.
 */
router.get("/cancel", paymentCancel);

// ── Stripe ────────────────────────────────────────────────────────────────────
/**
 * POST /:id/pay/stripe
 * Creates a Stripe PaymentIntent for the specified order and returns the clientSecret to the front-end.
 */
router.post("/:id/pay/stripe", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();
    if (uid !== winnerId) return res.status(403).json({ message: "Not authorized" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const { clientSecret, paymentIntentId } = await createStripePaymentIntent(order);
    res.json({ clientSecret, paymentIntentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /stripe/webhook
 * Webhook endpoint called by Stripe. Validates the signature and updates the order status to paid upon success.
 * Note: Raw body is required and must be configured in app.js.
 */
router.post("/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).json({ message: "Missing stripe-signature header" });

  let event;
  try {
    event = constructStripeEvent(req.rawBody, sig);
  } catch (err) {
    return res.status(400).json({ message: `Webhook signature failed: ${err.message}` });
  }

  if (event.type === "payment_intent.succeeded") {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "processing",
        paidAt: new Date(),
      });
    }
  }

  res.json({ received: true });
});

// ── STAMMP ────────────────────────────────────────────────────────────────────
/**
 * POST /:id/pay/stammp
 * Initiates a STAMMP payment for the specified order and returns the paymentUrl.
 */
router.post("/:id/pay/stammp", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();
    if (uid !== winnerId) return res.status(403).json({ message: "Not authorized" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const { paymentUrl, reference } = await createStammpPayment(order);
    res.json({ paymentUrl, reference });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /stammp/webhook
 * Webhook callback from STAMMP after payment. Verifies the callback and updates the order status.
 */
router.post("/stammp/webhook", async (req, res) => {
  try {
    const { orderId, paid } = verifyStammpCallback(req.body);
    if (paid) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "processing",
        paidAt: new Date(),
      });
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /my
 * Retrieves all orders where the currently authenticated user is either the winner (buyer) or the seller.
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ winner: req.user._id }, { seller: req.user._id }],
    })
      .populate({ path: "auction", populate: { path: "Product", select: "name image" } })
      .populate("winner", "fullName email")
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /:id/shipping
 * Updates the shipping details for a specific order.
 */
router.patch("/:id/shipping", authMiddleware, updateShipping);

/**
 * PATCH /:id/status
 * Updates the status of an order (e.g., shipped, delivered).
 */
router.patch("/:id/status", authMiddleware, updateOrderStatus);

/**
 * GET /:id/delivery
 * Retrieves delivery-related data for a specific order.
 */
router.get("/:id/delivery", authMiddleware, getDeliveryData);

/**
 * POST /verify-delivery
 * Verifies a delivery QR code to confirm order delivery.
 */
router.post("/verify-delivery", authMiddleware, verifyDeliveryQr);

/**
 * GET /:id
 * Retrieves detailed information for a specific order.
 * Ensures that only the authorized buyer or seller can access the order data.
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({ path: "auction", populate: { path: "Product", select: "name image description" } })
      .populate("winner", "fullName email")
      .populate("seller", "fullName email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const uid = req.user._id.toString();
    const winnerId = order.winner?._id?.toString() || order.winner?.toString();
    const sellerId = order.seller?._id?.toString() || order.seller?.toString();
    if (winnerId !== uid && sellerId !== uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
