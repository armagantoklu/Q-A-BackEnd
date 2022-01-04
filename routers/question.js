const express = require("express");
const questionModel = require('../models/question');
const router = express.Router();
const questionController = require("../controller/question");
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/author');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers');
const answerController = require('./answer');
const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware');
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware');
router.get('/', questionQueryMiddleware(questionModel, {
    population: {
        path: 'user',
        select: 'name email'
    }
}), questionController.getAllQuestions);
router.get('/:id', checkQuestionExist,answerQueryMiddleware(questionModel,{population : [{
    path : 'user', 
    select : 'name email',
},{
    path : 'answers',
    select : 'content'
}]}), questionController.getSingleQuestion);
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], questionController.likeQuestion);
router.get('/:id/unlike', [getAccessToRoute, checkQuestionExist], questionController.unlikeQuestion);
router.put('/:id/edit', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], questionController.editQuestion);
router.post('/ask', getAccessToRoute, questionController.askNewQuestion);
router.delete('/:id/delete', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], questionController.deleteQuestion);

router.use('/:question_id/answer', checkQuestionExist, answerController);

module.exports = router;
