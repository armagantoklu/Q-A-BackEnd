const author = require("./author");
const question = require("./question");
const users = require('./users');
const admin = require('./admin');
const express = require("express");
const router = express.Router();

router.use("/author", author);
router.use("/question", question);
router.use('/users', users);
router.use('/admin', admin);

module.exports = router;



