import { Router } from "express";
import { shipchargeController } from "../../controllers";
import { isAdmin } from "../middlewares/isAdminAuth";

const router = Router();

router.post("", isAdmin, shipchargeController.updateShipCharge);
router.get("", shipchargeController.getShipCharge);

export default router;
