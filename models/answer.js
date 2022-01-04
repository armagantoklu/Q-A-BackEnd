const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionModel = require('./question');

const answerSchema = new Schema({

    content: {
        type: String,
        required: [true, 'Lütfen cevap yazınız'],
        minlength: [10, 'Cevabınızın minimum uzunluğu 10 karakter olmalıdır']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'question',
        required: true
    }

});
answerSchema.pre('save', async function (next) {
    if (!this.isModified('user')) {
        return next();
    }
    try {
        const question = await questionModel.findById(this.question);
        question.answers.push(this._id);
        question.answerCount = question.answers.length;
        await question.save();
        next();
    } catch (err) {
        return next(err);
    }

});
module.exports = mongoose.model('answer', answerSchema);