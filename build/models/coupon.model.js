"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Coupon = new mongoose_1.default.Schema({
    couponCode: String,
    discountInPercent: Number,
    startDate: Date,
    endDate: Date,
    numberOfUsers: { type: Number, default: 0 },
    maxCartAmount: { type: Number, default: 0 },
    minCartAmount: { type: Number, default: 0 },
    appliedCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    earnByCoupon: { type: Number, default: 0 },
}, { timestamps: true });
Coupon.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("coupons", Coupon);
