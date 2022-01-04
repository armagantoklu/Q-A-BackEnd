const userModel = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncWrapper = require("express-async-handler");
const getSingleUser = asyncWrapper(async (req, res, next) => {

    res.status(200).json({
        success: true,
        message: req.data
    });

});
const getAllUsers = asyncWrapper(async (req, res, next) => {

    
    res.status(200).json({
        success: true,
        message: res.queryResults
    });

});
module.exports = { getSingleUser, getAllUsers }