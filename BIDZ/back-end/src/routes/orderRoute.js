import express from "express";
import { 
  createOrder, paymentSuccess, paymentCancel, updateShipping, 
  updateOrderStatus, payWithWallet, payWithStripe, stripeWebhook,
  payWithStammp, stammpWebhook, getMyOrders, getOrderById 
} from "../controller/orderController.js";
import { getDeliveryData, verifyDeliveryQr } from "../controller/deliveryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

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
 * Creates a Stripe PaymentIntent.
 */
router.post("/:id/pay/stripe", authMiddleware, payWithStripe);

/**
 * POST /stripe/webhook
 * Webhook endpoint called by Stripe.
 */
router.post("/stripe/webhook", stripeWebhook);

// ── STAMMP ────────────────────────────────────────────────────────────────────
/**
 * POST /:id/pay/stammp
 * Initiates a STAMMP payment.
 */
router.post("/:id/pay/stammp", authMiddleware, payWithStammp);

/**
 * POST /stammp/webhook
 * Webhook callback from STAMMP after payment.
 */
router.post("/stammp/webhook", stammpWebhook);

/**
 * GET /my
 * Retrieves all orders for the currently authenticated user.
 */
router.get("/my", authMiddleware, getMyOrders);

/**
 * PATCH /:id/shipping
 * Updates the shipping details for a specific order.
 */
router.patch("/:id/shipping", authMiddleware, updateShipping);

/**
 * PATCH /:id/status
 * Updates the status of an order.
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
 */
router.get("/:id", authMiddleware, getOrderById);

export default router;
