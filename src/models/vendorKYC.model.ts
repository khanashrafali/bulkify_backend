import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const VendorKyc = new mongoose.Schema(
  {
    vendor: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    cinNumber: { type: String, default: "" },
    gstCertificate: { type: String, default: "" },
    panAvatar: { type: String, default: "" },
    coiAvatar: { type: String, default: "" }
  },
  { timestamps: true }
);

// User.index({ "address.location": "2dsphere" });
VendorKyc.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("vendorkyc", VendorKyc);
