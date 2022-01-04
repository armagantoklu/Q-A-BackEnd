const questionModel = require('../models/question');
const asyncWrapper = require("express-async-handler");
const CustomError = require('../helpers/error/CustomError');
require('../models/answer');
require('../models/user');

const askNewQuestion = asyncWrapper(async (req, res, next) => {
    const information = req.body;
    const question = await questionModel.create({
        title: information.title,
        content: information.content,
        user: req.user.id
    });
    res.status(200).json({
        success: true,
        message: question
    });
});
const getAllQuestions = asyncWrapper(async (req, res, next) => {
    res.status(200).json(res.queryResults);
});
const getSingleQuestion = asyncWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: res.queryResults
    });
});
const editQuestion = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const question = await questionModel.findById(id);
    question.title = title,
        question.content = content,
        await question.save();
    res.status(200).json({
        success: true,
        message: question
    });
});
const deleteQuestion = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    await questionModel.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'Silme işlemi başarılı'
    });
});
const likeQuestion = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await questionModel.findById(id);

    if (question.likes.includes(req.user.id)) {

        return next(new CustomError('bu kullanıcı zaten bu postu beğenmiş', 400));
    };
    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();
    return res.status(200).json({
        succes: true,
        message: 'soru beğenildi'
    });

});
const unlikeQuestion = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const question = await questionModel.findById(id);
    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError('bu kullanıcı zaten bu postu beğenmemiş', 400));
    };
    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index, 1);
    question.likeCount = question.likes.length;
    await question.save();
    res.status(200).json({
        success: true,
        message: 'soru beğenmekten vazgeçildi'
    })


});
module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    unlikeQuestion
}
