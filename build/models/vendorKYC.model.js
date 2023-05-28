"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const VendorKyc = new mongoose_1.default.Schema({
    vendor: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'users' },
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    cinNumber: { type: String, default: "" },
    gstCertificate: { type: String, default: "" },
    panAvatar: { type: String, default: "" },
    coiAvatar: { type: String, default: "" }
}, { timestamps: true });
// User.index({ "address.location": "2dsphere" });
VendorKyc.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("vendorkyc", VendorKyc);
