/**
 * DEMO SEED SCRIPT
 * Run: node seed-demo.js
 * Creates 3 test accounts: buyer / seller / admin
 * Password for all: 123
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bidzone";

// Inline schemas to avoid circular imports
const userSchema = new mongoose.Schema({
  fullName: String, email: String, password: String,
  phone: { type: String, default: "" },
  role: { type: String, default: "buyer" },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  balance: { type: Number, default: 0 },
  lockedBalance: { type: Number, default: 0 },
  escrowBalance: { type: Number, default: 0 },
}, { timestamps: true });

const User   = mongoose.model("User",   userSchema);
const Wallet = mongoose.model("Wallet", walletSchema);

const DEMO_ACCOUNTS = [
  { fullName: "Demo Buyer",  email: "buyer@demo.com",  password: "123", role: "buyer",  wallet: 5000 },
  { fullName: "Demo Seller", email: "seller@demo.com", password: "123", role: "seller", wallet: 2000 },
  { fullName: "Demo Admin",  email: "admin@demo.com",  password: "123", role: "admin",  wallet: 0    },
];

async function seed() {
  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB");

  for (const acc of DEMO_ACCOUNTS) {
    const existing = await User.findOne({ email: acc.email });
    if (existing) {
      console.log(`⏭  ${acc.role} already exists: ${acc.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(acc.password, 10);
    const user = await User.create({ fullName: acc.fullName, email: acc.email, password: hashed, role: acc.role });
    await Wallet.create({ user: user._id, balance: acc.wallet });
    console.log(`✅ Created ${acc.role}: ${acc.email} / password: ${acc.password}`);
  }

  console.log("\n🎉 Demo accounts ready!\n");
  console.log("  buyer@demo.com  / 123  →  Buyer Dashboard");
  console.log("  seller@demo.com / 123  →  Seller Dashboard");
  console.log("  admin@demo.com  / 123  →  Admin Dashboard\n");

  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
