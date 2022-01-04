const userModel = require('../../models/user');
const questionModel = require('../../models/question');
const answerModel = require('../../models/answer');
const CustomError = require("../../helpers/error/CustomError");
const asyncWrapper = require("express-async-handler");

const chechUserExist = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
        return next(new CustomError(`Girilen id'ye ait kullanıcı bulunamadı`, 400))
    };
    req.data = user;
    next();

});
const checkQuestionExist = asyncWrapper(async (req, res, next) => {
    const questionid = req.params.id || req.params.question_id;
    const question = await questionModel.findById(questionid);
    if (!question) {
        return next(new CustomError(`Girilen id'ye ait soru bulunamadı`, 400))
    };
    req.data = question;
    next();

});
const checkQuestionAndAnswersExist = asyncWrapper(async (req, res, next) => {
    const questionid = req.params.question_id;
    const answerid = req.params.answer_id;

    const answer = await answerModel.findOne({
        _id: answerid,
        question: questionid,
    });
    if (!answer) {
        return next(new CustomError(`Girilen soru bilgisine ait cevap bulunamadı`, 400))
    };
    req.data = answer;
    next();

})
module.exports = {
    chechUserExist,
    checkQuestionExist,
    checkQuestionAndAnswersExist
};