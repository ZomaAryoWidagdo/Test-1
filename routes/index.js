"use strict";
const router = require("express").Router();
const users = require("./Users");
const items = require("./Items");
router.use("/users", users);
router.use("/items", items);

module.exports = router;
