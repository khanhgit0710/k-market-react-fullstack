import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  userId: { type: String, required: true }, // ID của người mua bên Clerk
  customerName: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Chờ thanh toán" }, // Trạng thái: Chờ thanh toán, Đã duyệt, Đang giao...
  createdAt: { type: Date, default: Date.now },
});

export const Order = models.Order || model("Order", OrderSchema);