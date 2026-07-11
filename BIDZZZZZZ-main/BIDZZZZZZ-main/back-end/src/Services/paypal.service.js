import paypal from "@paypal/checkout-server-sdk";
import { client } from "./PayPal.js";
export const createPayPalOrder = async (order) => {
  const request = new paypal.orders.OrdersCreateRequest();

  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: order._id.toString(),
        amount: {
          currency_code: "USD",
          value: order.finalPrice.toString(),
        },
      },
    ],
    application_context: {
      return_url: `${process.env.BASE_URL}/api/orders/success?orderId=${order._id}`,
      cancel_url: `${process.env.BASE_URL}/api/orders/cancel?orderId=${order._id}`,
    },
  });

  const response = await client().execute(request);
  return response.result;
};