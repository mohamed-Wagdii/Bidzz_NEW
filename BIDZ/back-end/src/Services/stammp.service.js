import https from "https";
import http from "http";
import { URL } from "url";

const STAMMP_API_KEY = process.env.STAMMP_API_KEY;
const STAMMP_API_URL = process.env.STAMMP_API_URL || "https://api.stammp.com";

// Simple HTTP helper — no extra deps, same style as the rest of the project
function stammpRequest(path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STAMMP_API_URL);
    const payload = JSON.stringify(body);
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "Authorization": `Bearer ${STAMMP_API_KEY}`,
      },
    };

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("STAMMP: invalid JSON response"));
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// Create a STAMMP payment for an order — returns { paymentUrl, reference }
export const createStammpPayment = async (order) => {
  if (!STAMMP_API_KEY) throw new Error("STAMMP_API_KEY is not configured.");

  const result = await stammpRequest("/v1/payments", {
    amount: order.finalPrice,
    currency: "USD",
    reference: order._id.toString(),
    return_url: `${process.env.BASE_URL}/api/orders/stammp/callback?orderId=${order._id}`,
    cancel_url: `${process.env.BASE_URL}/api/orders/cancel?orderId=${order._id}`,
  });

  if (!result.payment_url) throw new Error("STAMMP: missing payment_url in response");
  return { paymentUrl: result.payment_url, reference: result.reference || order._id.toString() };
};

// Verify an incoming STAMMP webhook/callback
// STAMMP sends the order reference and a status field
export const verifyStammpCallback = (body) => {
  if (!body || !body.reference || !body.status) {
    throw new Error("Invalid STAMMP callback payload");
  }
  return {
    orderId: body.reference,
    paid: body.status === "paid" || body.status === "PAID" || body.status === "SUCCESS",
  };
};
