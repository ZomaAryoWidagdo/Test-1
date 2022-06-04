"use strict";
const router = require("express").Router();
const CompanyController = require("../controllers/Companies");
const { authentication } = require("../middlewares/authentication");

router.use(authentication);

router.get("/", CompanyController.getAll);
router.get("/:id", CompanyController.getById);
router.post("/add", CompanyController.add);
router.put("/:id", CompanyController.update);
router.delete("/:id", CompanyController.delete);

module.exports = router;
