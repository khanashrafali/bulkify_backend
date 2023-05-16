import { Router } from "express";
import { dynamicController } from "../../controllers";

const router = Router();

router.post("", dynamicController.saveHeading);
router.patch("/:id",dynamicController.updateHeading);
router.get("/:id", dynamicController.getHeading);
router.get("", dynamicController.getAllHeading);

export default router;
