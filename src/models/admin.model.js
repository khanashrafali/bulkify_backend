const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
// import { CONSTANT, helper } from "../utils";
// import { userRole } from "../utils/interfaces";

const Admin = new mongoose.Schema(
  {
    name: String,
    email: { type: String, trim: true, default: "" },
    role: { type: String, enum: ['ADMIN','SUPER_ADMIN'] },
    // isApproved: { type: String, enum: CONSTANT.APPROVAL_STATUS },
    isActive: { type: Boolean, default: false },
    // isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: true },
    date: { type: Date, default: new Date().valueOf().toString() },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    wrongAuthCount: {type: Number, default:0},
    password: String,
  },
  { timestamps: true }
);

// Admin.index({ "address.location": "2dsphere" });
Admin.plugin(mongooseDelete, { overrideMethods: true });

module.exports = mongoose.model("admins", Admin);