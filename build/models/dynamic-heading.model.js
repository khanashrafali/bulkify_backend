"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const DynamicHeading = new mongoose_1.default.Schema({
    heading: { type: String, default: "" },
}, { timestamps: true });
// DynamicHeading.index({ "address.location": "2dsphere" });
DynamicHeading.plugin(mongoose_delete_1.default, { overrideMethods: true });
exports.default = mongoose_1.default.model("dynamic_Heading", DynamicHeading);
