import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, userId: 1 }, { unique: true });

export const Review = models.Review || model("Review", ReviewSchema);
