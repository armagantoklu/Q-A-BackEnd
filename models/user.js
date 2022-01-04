const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const questionModel = require('./question');
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "isim boş olamaz"]
    },

    email: {
        type: String,
        required: [true, "e-mail adresi boş bırakılamaz"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Lütfen geçerli bir e-mail adrsi giriniz"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    password: {
        type: String,
        minlength: [6, "şifre en az 6 karakterli olmalı"],
        required: [true, "şifre boş olamaz"],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpg",
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
});
userSchema.methods.getResetPasswordFromUser=function(){
    const {RESET_PASSWORD_EXPIRE}=process.env;
    const randomHexString = crypto.randomBytes(15).toString('hex');
    const resetPasswordToken = crypto.createHash('SHA256').update(randomHexString).digest('hex');
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
    return resetPasswordToken;
};
userSchema.pre('save', function (next) {
    if (!this.isModified("password")) {
        next();
    };
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err);
            this.password = hash;
            next();
        });
    });

});
userSchema.methods.generateJwtFromUser = function () {
    const { SECRET_KEY, EXPIRE } = process.env;
    const payload = {
        id: this._id,
        name: this.name,
        email: this.email
    }
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: EXPIRE
    });

    return token;
};
userSchema.post('remove',async function(){
    await questionModel.deleteMany({
        user : this._id
    });
})
module.exports = mongoose.model("user", userSchema);

