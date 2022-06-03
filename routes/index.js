"use strict";
const router = require("express").Router();
const users = require("./Users");

router.use("/user", users);

module.exports = router;
