const express = require("express");
const router = express.Router();
const { getUserReport, getGlobalReport } = require("./report.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth-middleware");

router.get("/user/:userId", verifyToken, getUserReport);
router.get("/global", verifyToken, isAdmin, getGlobalReport);

module.exports = router;