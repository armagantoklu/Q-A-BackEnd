const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const questionSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Lütfen başlık alanını doldurunuz'],
        unique: true,
        minlength: [10, 'Başlık minimum 10 karakterli olmalıdır']
    },
    content: {
        type: String,
        required: [true, 'Lütfen içerik alanını doldurunuz'],
        minlength: [20, 'Başlık minimum 20 karakterli olmalıdır']
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'user'
        }
    ],
    answerCount: {
        type: Number,
        default: 0
    },
    answers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'answer'
        }
    ]

});
questionSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next();
    }
    this.slug = this.makeSlug();
    next();
});
questionSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true
    });
};
module.exports = mongoose.model('question', questionSchema);
