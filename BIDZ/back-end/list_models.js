import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
async function list() {
    try {
        const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await models.json();
        console.log("Models:", data.models?.map(m => m.name));
    } catch (e) {
        console.error(e);
    }
}
list();
