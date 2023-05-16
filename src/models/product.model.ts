import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { nanoid } from "nanoid";
const mSlug = require("mongoose-slug-updater");

const Product = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    parentId: { type: mongoose.SchemaTypes.ObjectId, ref: "products", default: null },
    variants: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "products" }], default: [] },
    slug: { type: String, slug: ["name", "shortDesc"], unique: true },
    shortDesc: { type: String, default: "" },
    fullDesc: { type: String, default: "" },
    images: { type: [String], default: [] },
    status: { type: Boolean, default: true },
    brand: { type: mongoose.SchemaTypes.ObjectId, ref: "brands" },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    subCategory: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    sizes: { type: [String], default: [] },
    color: String,
    rating: { type: Number, default: 0 },
    SKU: { type: String, default: () => nanoid(10) },
    mrp: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    isCustomize: { type: Boolean, default: false },
  },
  { timestamps: true }
);

Product.plugin(mongooseDelete, { overrideMethods: true });
Product.plugin(mSlug, {});
Product.index({ sortDesc: "text", name: "text" });

export default mongoose.model("products", Product);
