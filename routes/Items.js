"use strict";
const router = require("express").Router();
const ItemController = require("../controllers/Items");
const { authentication } = require("../middlewares/authentication");

router.use(authentication);

router.get("/", ItemController.getAll);
router.get("/:id", ItemController.getById);
router.post("/add", ItemController.add);
router.patch("/:id", ItemController.update);
router.delete("/:id", ItemController.delete);

module.exports = router;
