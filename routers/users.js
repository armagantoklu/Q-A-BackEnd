const express = require("express");
const router = express.Router();
const userController = require('../controller/users');
const userModel = require('../models/user');
const { chechUserExist } = require('../middlewares/database/databaseErrorHelpers');
const  userQueryMiddleware  = require('../middlewares/query/userQueryMiddleware');

router.get('/', userQueryMiddleware(userModel), userController.getAllUsers);
router.get('/:id', chechUserExist, userController.getSingleUser);


module.exports = router;
