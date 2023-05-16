import { shipChargeModel } from "../models";
import { helper } from "../utils";

helper.loadEnvFile();

const updateShipCharge = async (body: any) => {
  try {
    return await shipChargeModel.findOneAndUpdate({}, body, { new: true, upsert: true });
  } catch (error) {
    throw error;
  }
};

const getShipCharge = async () => {
  try {
    return await shipChargeModel.find();
  } catch (error) {
    throw error;
  }
};

export default {
  updateShipCharge,
  getShipCharge,
};
