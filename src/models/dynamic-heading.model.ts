import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { helper } from "../utils";

const DynamicHeading = new mongoose.Schema(
  {
    heading: { type: String, default: "" },
  },
  { timestamps: true }
);

// DynamicHeading.index({ "address.location": "2dsphere" });
DynamicHeading.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("dynamic_Heading", DynamicHeading);
