const { Router } = require("express");
const { isAdmin } = require("../middlewares/isAdminAuth");

const router = Router();

module.exports = router;