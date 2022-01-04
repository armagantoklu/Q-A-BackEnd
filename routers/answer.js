const express = require('express');
const {getAccessToRoute} = require('../middlewares/authorization/author');
const {checkQuestionAndAnswersExist} = require('../middlewares/database/databaseErrorHelpers');
const answerController = require('../controller/answer');
const {getAnswerOwnerAccess} = require('../middlewares/authorization/author');
const router = express.Router({mergeParams : true});
router.post('/',getAccessToRoute,answerController.addNewAnswer);
router.get('/',answerController.getAllAnswers);
router.get('/:answer_id',checkQuestionAndAnswersExist,answerController.getSingleAnswer);
router.put('/:answer_id/edit',[checkQuestionAndAnswersExist,getAccessToRoute,getAnswerOwnerAccess],answerController.editAnswer);
router.delete('/:answer_id/delete',[checkQuestionAndAnswersExist,getAccessToRoute,getAnswerOwnerAccess],answerController.deleteAnswer);
router.get('/:answer_id/like',[checkQuestionAndAnswersExist,getAccessToRoute],answerController.likeAnswer);
router.get('/:answer_id/unlike',[checkQuestionAndAnswersExist,getAccessToRoute],answerController.unlikeAnswer);

module.exports = router;