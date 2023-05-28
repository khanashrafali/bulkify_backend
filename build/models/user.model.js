"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
const User = new mongoose_1.default.Schema({
    avatar: { type: String, default: null },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    companyName: { type: String, default: "" },
    country: { type: String, default: "" },
    categoryForBusiness: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "categories" },
    isActive: { type: Boolean, default: false },
    isApproved: { type: String, enum: utils_1.CONSTANT.APPROVAL_STATUS, default: interfaces_1.ApprovalStatus.PENDING },
    role: { type: String, enum: utils_1.CONSTANT.USER_ROLES, default: interfaces_1.UserRole.USER },
    isProfileComplete: { type: Boolean, default: false },
    isVendorKycComplete: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    date: { type: Date, default: utils_1.helper.currentDate },
    varificationToken: String,
    expirationTime: Date,
    blockDate: Date,
    verificationType: String,
    retryCount: 0,
    // uid: String,
    // providerData: [],
}, { timestamps: true });
// User.index({ "address.location": "2dsphere" });
User.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("users", User);
