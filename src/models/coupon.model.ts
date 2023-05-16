import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const Coupon = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

Coupon.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("coupons", Coupon);
