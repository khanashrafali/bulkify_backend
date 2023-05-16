import { NextFunction, Request, Response } from "express";
import { shipChargeService } from "../services";
import { helper } from "../utils";

/**
 * create coupon api
 */
const updateShipCharge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    await shipChargeService.updateShipCharge(req.body);
    helper.buildResponse(res, "added sucessfully");
  } catch (error) {
    next(error);
  }
};

/**
 * get single coupon api
 */
const getShipCharge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await shipChargeService.getShipCharge();
    helper.buildResponse(res, "fetched sucessfully", result);
  } catch (error) {
    next(error);
  }
};

export default {
  updateShipCharge,
  getShipCharge,
};
