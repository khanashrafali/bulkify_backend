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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const voucher_code_generator_1 = __importDefault(require("voucher-code-generator"));
const cart_service_1 = __importDefault(require("./cart.service"));
utils_1.helper.loadEnvFile();
/**
 * get coupon by id handler
 */
const _fetchCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    let coupon = yield models_1.couponModel.findOne({ _id: couponId });
    if (!coupon)
        throw utils_1.helper.buildError("No coupon found with this id", 404);
    return coupon;
});
/**
 * create coupon handler
 */
const addCoupon = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let couponCode = data === null || data === void 0 ? void 0 : data.code;
        if (!(couponCode === null || couponCode === void 0 ? void 0 : couponCode.length)) {
            couponCode = (_a = voucher_code_generator_1.default
                .generate({ length: 8, count: 1, prefix: "mani-", charset: "alphanumeric" })
                .at(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        }
        yield models_1.couponModel.create(Object.assign(Object.assign({}, data), { couponCode, createBy: req.user._id }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * update coupon handler
 */
const updateCoupon = (couponId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        let couponCode = data === null || data === void 0 ? void 0 : data.code;
        if (!(couponCode === null || couponCode === void 0 ? void 0 : couponCode.length)) {
            couponCode = (_b = voucher_code_generator_1.default
                .generate({ length: 8, count: 1, prefix: "mani-", charset: "alphanumeric" })
                .at(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase();
        }
        yield ((_c = (yield _fetchCoupon(couponId))) === null || _c === void 0 ? void 0 : _c.set(Object.assign(Object.assign({}, data), { couponCode })).save());
    }
    catch (error) {
        throw error;
    }
});
/**
 * update coupon status handler
 */
const updateCouponStatus = (couponId, isPrivate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield _fetchCoupon(couponId)).set({ isPrivate }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete coupon handler
 */
const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield _fetchCoupon(couponId)).delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon by id handler
 */
const getCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield _fetchCoupon(couponId);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon list handler
 */
const getCoupons = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        let condition = {};
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_d = queryParams.textSearch) === null || _d === void 0 ? void 0 : _d.length) {
            condition.couponCode = { $regex: queryParams.textSearch, $options: "si" };
        }
        const count = yield models_1.couponModel.countDocuments(condition);
        const mongoQuery = models_1.couponModel.find(condition).sort({ createdAt: -1 });
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon list for users handler
 */
const getCouponsByUsers = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        let condition = { isPrivate: false };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if ((_e = queryParams.textSearch) === null || _e === void 0 ? void 0 : _e.length)
            condition.code = { $regex: utils_1.helper.regxEscape(queryParams.textSearch), $options: "i" };
        if ("createdAt" in queryParams)
            condition.date = queryParams.createdAt;
        if ("endDate" in queryParams)
            condition.endDate = queryParams.endDate;
        if ("startDate" in queryParams)
            condition.startDate = queryParams.startDate;
        if ("discountInPercent" in queryParams)
            condition.discountInPercent = queryParams.discountInPercent;
        if ("numberOfUsers" in queryParams)
            condition.numberOfUsers = queryParams.numberOfUsers;
        const count = yield models_1.couponModel.countDocuments(condition);
        const mongoQuery = models_1.couponModel.find(condition).sort({ createdAt: -1 });
        let docs = [];
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get coupon by code handler
 */
const postApplyCoupon = (req, couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cart = yield cart_service_1.default.getCart(req.user._id);
        let now = utils_1.helper.currentDate;
        let condition = {
            couponCode,
            isPrivate: false,
            startDate: { $lte: now },
            endDate: { $gte: now },
            maxCartAmount: { $gte: cart.total },
            minCartAmount: { $lte: cart.total },
        };
        const coupon = yield models_1.couponModel.findOne(condition);
        if (!coupon)
            throw utils_1.helper.buildError("No valid coupon found with this code", 404);
        const couponToJson = coupon.toJSON();
        if (couponToJson.appliedCount >= couponToJson.numberOfUsers) {
            throw utils_1.helper.buildError("Coupon expired", 400);
        }
        return couponToJson;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    updateCouponStatus,
    getCoupons,
    postApplyCoupon,
    getCouponsByUsers,
};
