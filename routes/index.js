"use strict";
const router = require("express").Router();
const users = require("./Users");
const items = require("./Items");
const companies = require("./Companies");

const errorHandler = require("../middlewares/errorHandler");

router.use("/users", users);
router.use("/items", items);
router.use("/companies", companies);

router.use(errorHandler);

module.exports = router;
