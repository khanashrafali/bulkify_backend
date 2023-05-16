import mongoose from "mongoose";

const Cart = new mongoose.Schema(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "products" },
    size: String,
    quantity: { type: Number, default: 0 },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    coupleName: { type: String },
    customization: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("carts", Cart);
