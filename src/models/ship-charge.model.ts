import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const shipCharge = new mongoose.Schema(
  {
    cartValue: { type: Number, default: 0 },
    shipCharge: { type: Number, default: 0 },
  },
  { timestamps: true }
);

shipCharge.plugin(mongooseDelete, { overrideMethods: true });

export default mongoose.model("shipCharge", shipCharge);
