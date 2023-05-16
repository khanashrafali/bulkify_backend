import { NextFunction, Request, Response } from "express";
import { dynamicService } from "../services";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";

/**
 * add item to cart api
 */
const saveHeading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await dynamicService.saveQueiry(req.body);
    helper.buildResponse(res, "Data saved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * update main category api
 */
const updateHeading = async (req: Request, res: Response, next: NextFunction) => {
    try {
      helper.handlePayloadError(req);
      const result = await dynamicService.updateHeading(
        req.params.id,
        req.body.heading
      );
      helper.buildResponse(res, "Data updated successfully", result);
    } catch (error) {
      next(error);
    }
};

const getAllHeading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await dynamicService.getQueries(req.query);
    helper.buildResponse(res, "Data fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

const getHeading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    helper.handlePayloadError(req);
    let result = await dynamicService.getQuery(req.params.id);
    helper.buildResponse(res, "Data fetched Successfully.", result);
  } catch (error) {
    next(error);
  }
};

export default {
  saveHeading,
  getAllHeading,
  getHeading,
  updateHeading
};
