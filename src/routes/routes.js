const { Router } = require("express");
const { adminRoutes } = require(".");
const { errorCtrl } = require("../controllers");

const router = Router();

router.use("api/v1/admin", adminRoutes);

router.use("/api/v1/*", errorCtrl.handle404);

router.use(errorCtrl.errorHandler);

module.exports = router;