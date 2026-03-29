import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: String, required: true
  },
  items: [  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    newPrice: String,
    image: String,
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);