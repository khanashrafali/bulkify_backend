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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const admin_service_1 = __importDefault(require("./admin.service"));
const product_service_1 = __importDefault(require("./product.service"));
utils_1.helper.loadEnvFile();
const calculateShipCharge = (cartTotal) => __awaiter(void 0, void 0, void 0, function* () {
    let config = yield admin_service_1.default.getConfigInfo();
    let shippingCharge = 0;
    if (config.cartTotalPrice > 0) {
        if (cartTotal < config.cartTotalPrice) {
            shippingCharge = config.shippingCharge;
        }
    }
    return shippingCharge;
});
const getCartTotal = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cartItems = yield models_1.cartModel.find({ user: userId }).populate({ path: "product" });
        const itemTotal = cartItems.reduce((amount, c) => c.quantity * c.product.sellingPrice + amount, 0);
        const shippingCharges = 0;
        return { totalItem: (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) || 0, itemTotal, shippingCharges, total: itemTotal + shippingCharges };
    }
    catch (error) {
        throw error;
    }
});
/**
 * check item is out of stock
 */
const checkOutOfStock = (productId, size, quantity, isCart) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield product_service_1.default.findProduct(productId);
    let productToJson = product.toJSON();
    let sizeExists = productToJson.sizes.find((v) => v == size);
    if (!sizeExists)
        throw utils_1.helper.buildError("Product not available!", 404);
    if (!isCart)
        return { product, size, cartItemQuantity: quantity };
    if (product.quantity < 1)
        throw utils_1.helper.buildError("Out of stocks", 400);
    if (product.quantity < quantity) {
        throw utils_1.helper.buildError(`Out of stock`, 400);
    }
    return { product, size, cartItemQuantity: quantity };
});
/**
 * add item into cart handler
 */
const addCartItem = (req, productId, size, quantity, customization, coupleName, throwExistsError = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkOutOfStock(productId, size, quantity, true);
        const cItem = yield models_1.cartModel.findOne({ product: productId, user: req.user._id });
        if (cItem && !throwExistsError)
            return;
        if (cItem)
            throw utils_1.helper.buildError("Item already added", 200);
        yield models_1.cartModel.create({ product: productId, size, quantity, customization, coupleName, user: req.user._id });
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete item from cart handler
 */
const deleteCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        yield cItem.remove();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * decrease item from cart handler
 */
const decreaseCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        let cItemToJson = cItem.toJSON();
        if (cItemToJson.quantity > 1)
            yield cItem.set({ quantity: cItemToJson.quantity - 1 }).save();
        else
            yield cItem.remove();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * increase item from cart handler
 */
const increaseCartItem = (req, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const cItem = yield models_1.cartModel.findOne({ _id: itemId, user: req.user._id });
        if (!cItem)
            throw utils_1.helper.buildError("No item found with this id", 404);
        let cItemToJson = cItem.toJSON();
        yield checkOutOfStock((_a = cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.product) === null || _a === void 0 ? void 0 : _a.toString(), (_c = (_b = cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.variant) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString(), (cItemToJson === null || cItemToJson === void 0 ? void 0 : cItemToJson.quantity) + 1, true);
        yield cItem.set({ quantity: cItemToJson.quantity + 1 }).save();
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get cart handler
 */
const getCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let items = yield models_1.cartModel.find({ user: userId }).populate({ path: "product" }).lean();
        let total = 0;
        let totalQty = 0;
        items = items.map((ci) => {
            total += ci.quantity * ci.product.sellingPrice;
            totalQty += ci.quantity;
            return ci;
        });
        return { items, total, totalQty };
    }
    catch (error) {
        yield clearCart(userId);
        throw error;
    }
});
/**
 * clear cart handler
 */
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.cartModel.deleteMany({ user: userId });
        return yield getCartTotal(userId);
    }
    catch (error) {
        throw error;
    }
});
/**
 * add items into cart handler
 */
const addCartItems = (req, items) => { var _a, items_1, items_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        yield clearCart(req.user._id);
        try {
            for (_a = true, items_1 = __asyncValues(items); items_1_1 = yield items_1.next(), _b = items_1_1.done, !_b;) {
                _d = items_1_1.value;
                _a = false;
                try {
                    let item = _d;
                    yield addCartItem(req, item.productId, item.size, item.quantity, item.coupleName, item.customization, false);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = items_1.return)) yield _c.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return yield getCartTotal(req.user._id);
    }
    catch (error) {
        throw error;
    }
}); };
exports.default = {
    addCartItem,
    deleteCartItem,
    decreaseCartItem,
    increaseCartItem,
    getCart,
    clearCart,
    checkOutOfStock,
    addCartItems,
    getCartTotal,
};
