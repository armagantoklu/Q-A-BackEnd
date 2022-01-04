const CustomError = require("../../helpers/error/CustomError");
const jwt = require('jsonwebtoken');
const { isTokenIncluded, getAccessTokenFromHeaders } = require('../../helpers/authorization/tokenhelpers');
const userModel = require('../../models/user');
const questionModel = require('../../models/question');
const answerModel = require('../../models/answer');
const asyncWrapper = require("express-async-handler");
const getAccessToRoute = (req, res, next) => {
    const { SECRET_KEY } = process.env;
    if (!isTokenIncluded(req)) {
        return next(new CustomError("authorization include edilmemiş", 401));
    }
    const accessToken = getAccessTokenFromHeaders(req);
    jwt.verify(accessToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError('Oturum Süreniz Doldu', 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next();
    });

};
const getAdminAccess = asyncWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (user.role !== 'admin') {
        return next(new CustomError('Sadece admin olanlar erişebilir', 403));
    }
    next();
});
const getQuestionOwnerAccess = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const questionId = req.params.id;
    const question = await questionModel.findById(questionId);
    if (userId != question.user) {
        return next(new CustomError('Soruları sadece soruyu yazan kişiler değiştirebilir', 403))
    };
    next();
});
const getAnswerOwnerAccess = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await answerModel.findById(answerId);
    if (answer.user != userId) {
        return next(new CustomError('sadece cevap sahipleri kendi cevabına erişebilir', 400));
    }
    next();
});
module.exports = { getAccessToRoute, getAdminAccess, getQuestionOwnerAccess, getAnswerOwnerAccess };