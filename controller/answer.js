const questionModel = require('../models/question');
const answerModel = require('../models/answer');
const CustomError = require("../helpers/error/CustomError");
const asyncWrapper = require("express-async-handler");


const addNewAnswer = asyncWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const userId = req.user.id;
    const information = req.body;

    const answer = await answerModel.create({
        ...information, //content :  information.content gibilerin hepsinin kısaltılarak tekte yazılması
        question: question_id,
        user: userId
    });
    return res.status(200).json({
        success: true,
        data: answer
    });

});
const getAllAnswers = asyncWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const question = await questionModel.findById(question_id).populate('answers');
    const answers = question.answers;
    res.status(200).json({
        success: true,
        count: answers.lenght,
        data: answers
    });
});
const getSingleAnswer = asyncWrapper(async (req, res, next) => {
    const answerid = req.params.answer_id;
    const answer = await answerModel.findById(answerid)
        .populate({
            path: 'user',
            select: 'name profile_image'
        })
        .populate({
            path: 'question',
            select: 'title content'
        });
    return res.status(200).json({
        success: true,
        data: answer
    });
});
const editAnswer = asyncWrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const { content } = req.body;
    let answer = await answerModel.findById(answer_id);
    answer.content = content;
    await answer.save();
    return res.status(200).json({
        success: true,
        message: 'Cevabınız güncellendi'
    });
});
const deleteAnswer = asyncWrapper(async (req, res, next) => {
    const { answer_id, question_id } = req.params;

    await answerModel.findByIdAndRemove(answer_id);
    const question = await questionModel.findById(question_id);
    const answerValue = question.answers.indexOf(answer_id);
    question.answers.splice(answerValue, 1);
    question.answerCount = question.answers.length;
    await question.save();
    return res.status(200).json({
        success: true,
        message: 'Cevap silme işlemi başarılı'
    });

});
const likeAnswer = asyncWrapper(async (req, res, next) => {
    const { answer_id } = req.params;

    const answer = await answerModel.findById(answer_id);

    if (answer.likes.includes(req.user.id)) {

        return next(new CustomError('bu kullanıcı zaten bu postu beğenmiş', 400));
    };
    answer.likes.push(req.user.id);
    await answer.save();
    return res.status(200).json({
        succes: true,
        message: 'cevap beğenildi'
    });

});
const unlikeAnswer = asyncWrapper(async (req, res, next) => {
    const { answer_id } = req.params;
    const answer = await answerModel.findById(answer_id);
    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError('bu kullanıcı zaten bu postu beğenmemiş', 400));
    };
    const index = answer.likes.indexOf(req.user.id);
    answer.likes.splice(index, 1);
    await answer.save();
    res.status(200).json({
        success: true,
        message: 'cevap beğenmekten vazgeçildi'
    })


});




module.exports = { addNewAnswer, getAllAnswers, getSingleAnswer, editAnswer, deleteAnswer ,likeAnswer,unlikeAnswer};
