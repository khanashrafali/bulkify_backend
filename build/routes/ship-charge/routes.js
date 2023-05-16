"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const isAdminAuth_1 = require("../middlewares/isAdminAuth");
const router = (0, express_1.Router)();
router.post("", isAdminAuth_1.isAdmin, controllers_1.shipchargeController.updateShipCharge);
router.get("", controllers_1.shipchargeController.getShipCharge);
exports.default = router;
