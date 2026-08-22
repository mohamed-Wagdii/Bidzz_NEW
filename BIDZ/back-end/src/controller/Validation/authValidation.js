import Joi from "joi";

// ⚠️ TESTING MODE: validation relaxed — tighten before production
export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),   // was min(6)
  phone: Joi.string().optional().allow(""),
  role: Joi.string().valid("buyer", "seller", "admin").default("buyer"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),   // was min(6)
});

export const shippingDetailsSchema = Joi.object({
  fullName: Joi.string().optional().allow(""),
  phone: Joi.string().optional().allow(""),
  country: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  address: Joi.string().optional().allow(""),
  notes: Joi.string().optional().allow(""),
});

export const orderShippingSchema = Joi.object({
  shippingAddress: Joi.string().optional().allow(""),
  shippingDetails: shippingDetailsSchema.optional()
}).unknown(true);
