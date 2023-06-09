"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAuth_1 = require("../middlewares/isAuth");
const isUserAuth_1 = require("../middlewares/isUserAuth");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const validator_1 = __importDefault(require("./validator"));
const router = (0, express_1.Router)();
// router.post("/generate-razor-pay-order", isUser, orderCtrl.generateRPayOrder);
// router.post("/create-order", validator.createOrder, orderCtrl.createOrder);
router.post("/create-rpay-order", isUserAuth_1.isUser, controllers_1.orderCtrl.postCreateRPayOrder);
router.post("/place-order", isUserAuth_1.isUser, controllers_1.orderCtrl.postPlaceOrder);
router.post("/place-cod-order", isUserAuth_1.isUser, validator_1.default.createOrder, controllers_1.orderCtrl.createCODOrder);
router.get("/download-orders", controllers_1.orderCtrl.downloadAllOrders);
router.patch("/update-request/:orderId/:id", isAdminAuth_1.isAdmin, controllers_1.orderCtrl.updateOrderRequest);
router.put("/return/:orderId/:orderItemId", (0, isAuth_1.isAuth)(), validator_1.default.cancelOrderItem, controllers_1.orderCtrl.returnOrderItem);
router.put("/:orderId/:orderItemId", (0, isAuth_1.isAuth)(), validator_1.default.cancelOrderItem, controllers_1.orderCtrl.cancelOrderItem);
router.put("/:orderId", (0, isAuth_1.isAuth)(), validator_1.default.cancelOrder, controllers_1.orderCtrl.cancelOrder);
router.patch("/status/:orderId", isAdminAuth_1.isAdmin, validator_1.default.updateOrderStatus, controllers_1.orderCtrl.updateOrderStatus);
router.patch("/payment/:orderId", isAdminAuth_1.isAdmin, validator_1.default.updateOrderPaymentStatus, controllers_1.orderCtrl.updateOrderPaymentStatus);
router.get("/by-admin", isAdminAuth_1.isAdmin, validator_1.default.getOrdersByAdmin, controllers_1.orderCtrl.getOrdersByAdmin);
router.get("/by-admin/:orderId", isAdminAuth_1.isAdmin, validator_1.default.getOrder, controllers_1.orderCtrl.getOrderByAdmin);
router.get("/:orderId", isUserAuth_1.isUser, validator_1.default.getOrder, controllers_1.orderCtrl.getOrder);
router.get("/:orderId/invoice", validator_1.default.getOrder, controllers_1.orderCtrl.getOrderInvoice);
router.get("", isUserAuth_1.isUser, validator_1.default.getOrders, controllers_1.orderCtrl.getOrders);
exports.default = router;
