import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    description: String,
    category: String,
    image: { type: String, required: true },
    stock: Number,
    price: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Product = new mongoose.model("Product", ProductSchema);
