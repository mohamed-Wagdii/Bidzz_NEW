import { GoogleGenerativeAI } from "@google/generative-ai";
import Auction from "../models/Auctions.js";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import Wallet from "../models/Wallet.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const tools = [
  {
    functionDeclarations: [
      {
        name: "getAuctions",
        description: "Get a list of active auctions currently running on the BidZone platform.",
        parameters: {
          type: "OBJECT",
          properties: {
            keyword: {
              type: "STRING",
              description: "Optional keyword to filter auctions by product name.",
            },
          },
        },
      },
      {
        name: "getUserBids",
        description: "Get the current user's recent bids.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getWalletBalance",
        description: "Get the current user's wallet balance, including locked or escrowed funds.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getSystemStats",
        description: "Get general statistics about the BidZone platform, like total active auctions.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      }
    ],
  },
];

const systemInstructionText = `You are BidZone AI, a helpful, professional AI assistant for the BidZone online auction platform. 
You can use tools to query the database live and answer user questions accurately.
If the user asks about their personal data (bids, wallet), use the tools. 
Answer in a friendly tone. IMPORTANT: Do NOT use any Markdown formatting (no **, no ##, no ---, no *, etc.). Use plain text only, separated by normal line breaks.`;

const chatModel = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  tools,
  systemInstruction: {
    role: "system",
    parts: [{ text: systemInstructionText }],
  },
});

async function executeTool(call, userId) {
  const { name, args } = call;

  if (name === "getAuctions") {
    const { keyword } = args;
    let auctions = await Auction.find({ status: "active" }).populate("Product").populate("seller", "fullName").limit(5);
    
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");
      auctions = auctions.filter(a => a.Product && keywordRegex.test(a.Product.name));
    }

    return auctions.map(a => ({
      auctionId: a._id,
      productName: a.Product?.name,
      description: a.Product?.description,
      seller: a.seller?.fullName,
      startingPrice: a.startingPrice,
      endTime: a.endTime,
    }));
  }

  if (name === "getUserBids") {
    if (!userId) return { error: "User is not authenticated. Cannot fetch bids." };
    const bids = await Bid.find({ buyer: userId }).populate({ path: "auction", populate: { path: "Product" } }).limit(5).sort({ createdAt: -1 });
    return bids.map(b => ({
      amount: b.amount,
      productName: b.auction?.Product?.name,
      time: b.createdAt,
      status: b.auction?.status,
    }));
  }

  if (name === "getWalletBalance") {
    if (!userId) return { error: "User is not authenticated. Cannot fetch wallet balance." };
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return { balance: 0, lockedBalance: 0, escrowBalance: 0 };
    return {
      balance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
      escrowBalance: wallet.escrowBalance,
    };
  }

  if (name === "getSystemStats") {
    const activeAuctions = await Auction.countDocuments({ status: "active" });
    const totalBids = await Bid.countDocuments();
    return { activeAuctions, totalBids };
  }

  return { error: `Tool ${name} not found.` };
}

export async function askAuctionAI(userQuery, userId) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const contents = [
    { role: "user", parts: [{ text: userQuery }] }
  ];

  let result = await chatModel.generateContent({ contents });
  let response = result.response;
  const functionCalls = response.functionCalls();

  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    const apiResponse = await executeTool(call, userId);
    
    contents.push({ role: "model", parts: response.candidates[0].content.parts });
    contents.push({
      role: "user",
      parts: [{
        functionResponse: {
          name: call.name,
          response: { result: apiResponse }
        }
      }]
    });
    
    result = await chatModel.generateContent({ contents });
    response = result.response;
  }

  return { answer: response.text(), sources: [] };
}