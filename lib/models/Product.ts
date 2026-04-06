import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  oldPrice: { type: String },
  newPrice: { type: String, required: true },
  sold: { type: String },
  location: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

export const Product = models.Product || model("Product", ProductSchema);