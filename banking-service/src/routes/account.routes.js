const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post("/", roleMiddleware("ADMIN_ROLE"), controller.createAccount);
router.patch("/:accountNumber/deactivate",
    roleMiddleware("ADMIN_ROLE"),
    controller.deactivateAccount
);

router.post("/:accountNumber/deposit",
    roleMiddleware("USER_ROLE"),
    controller.deposit
);

router.post("/:accountNumber/withdraw",
    roleMiddleware("USER_ROLE"),
    controller.withdraw
);

router.get("/:accountNumber/balance",
    roleMiddleware("USER_ROLE"),
    controller.getBalance
);

router.get("/:accountNumber/transactions",
    roleMiddleware("USER_ROLE"),
    controller.getTransactions
);

module.exports = router;