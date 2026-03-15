import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  oldPrice: { type: String },
  newPrice: { type: String, required: true },
  sold: { type: String },
  location: { type: String },
  category: { type: String, required: true },
});

// Lệnh này để kiểm tra nếu model đã tồn tại thì dùng lại, chưa thì mới tạo mới
export const Product = models.Product || model("Product", ProductSchema);