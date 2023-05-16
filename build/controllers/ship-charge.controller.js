"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * create coupon api
 */
const updateShipCharge = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        yield services_1.shipChargeService.updateShipCharge(req.body);
        utils_1.helper.buildResponse(res, "added sucessfully");
    }
    catch (error) {
        next(error);
    }
});
/**
 * get single coupon api
 */
const getShipCharge = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        utils_1.helper.handlePayloadError(req);
        let result = yield services_1.shipChargeService.getShipCharge();
        utils_1.helper.buildResponse(res, "fetched sucessfully", result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    updateShipCharge,
    getShipCharge,
};
