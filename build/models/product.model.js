"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const nanoid_1 = require("nanoid");
const mSlug = require("mongoose-slug-updater");
const Product = new mongoose_1.default.Schema({
    name: { type: String, default: "" },
    parentId: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products", default: null },
    variants: { type: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "products" }], default: [] },
    slug: { type: String, slug: ["name", "shortDesc"], unique: true },
    shortDesc: { type: String, default: "" },
    fullDesc: { type: String, default: "" },
    images: { type: [String], default: [] },
    status: { type: Boolean, default: true },
    brand: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "brands" },
    category: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    subCategory: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    sizes: { type: [String], default: [] },
    color: String,
    rating: { type: Number, default: 0 },
    SKU: { type: String, default: () => (0, nanoid_1.nanoid)(10) },
    mrp: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    isCustomize: { type: Boolean, default: false },
}, { timestamps: true });
Product.plugin(mongoose_delete_1.default, { overrideMethods: true });
Product.plugin(mSlug, {});
Product.index({ sortDesc: "text", name: "text" });
exports.default = mongoose_1.default.model("products", Product);
