"use strict";
const router = require("express").Router();
const TransactionController = require("../controllers/Transactions");
const { authentication } = require("../middlewares/authentication");

router.use(authentication);

router.get("/", TransactionController.getAll);
router.get("/:id", TransactionController.getById);
router.post("/:id", TransactionController.add);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

module.exports = router;
