import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  sold: { type: Number },
  location: { type: String },
  category: { type: String, required: true },
});

export const Product = models.Product || model("Product", ProductSchema);