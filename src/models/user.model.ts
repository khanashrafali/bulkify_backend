import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { CONSTANT, helper } from "../utils";
import { ApprovalStatus, UserRole } from "../utils/interfaces";

const User = new mongoose.Schema(
  {
    avatar: { type: String, default: null },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    companyName: { type: String, default: "" },
    country: { type: String, default: "" },
    categoryForBusiness: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    isActive: { type: Boolean, default: false },
    isApproved: { type: String, enum: CONSTANT.APPROVAL_STATUS, default: ApprovalStatus.PENDING },
    role: { type: String, enum: CONSTANT.USER_ROLES, default: UserRole.USER },
    isProfileComplete: { type: Boolean, default: false },
    isVendorKycComplete: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    retryCount: 0,
    // uid: String,
    // providerData: [],
  },
  { timestamps: true }
);

// User.index({ "address.location": "2dsphere" });
User.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("users", User);
