const userModel = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncWrapper = require("express-async-handler");
const { sendJwtToClient } = require('../helpers/authorization/tokenhelpers');
const { validateUserInput, comparePassword } = require('../helpers/input/inputHelpers');
const sendEmail = require('../helpers/libraries/sendEmail');
const authorHome = (req, res) => {
    res.json({
        "success": true,
        "message": "auth home page"
    })
};
const authorRegister = asyncWrapper(async (req, res, next) => {
    const { name, email, password, role, blocked } = req.body;

    const user = await userModel.create({
        name,
        email,
        password,
        role,
        blocked
    });

    sendJwtToClient(user, res);
});
const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name,
        }
    })
};
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError('Email ve Şifrenizi eksiksiz doldurunuz', 401));
    };
    const user = await userModel.findOne({ email }).select("+password");
    if (!comparePassword(password, user.password)) {
        return next(new CustomError('Parola yanlış', 401));
    };
    sendJwtToClient(user, res);
});
const logout = asyncWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env;
    return res
        .status(200)
        .cookie({
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === 'gelistirme' ? false : true
        }).json({
            success: true,
            message: "cikis yapildi"
        })
});
const imageUpload = asyncWrapper(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Resim yukleme basarili",
        data: user
    });
});
const forgotPassword = asyncWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    const user = await userModel.findOne({ email: resetEmail });
    if (!user) {
        return next(new CustomError('Girilen E-postaya ait kullanıcı bulunmuyor'), 400);
    };
    const resetPasswordToken = user.getResetPasswordFromUser();
    await user.save();

    const resetPasswordUrl = `http://localhost:5050/api/author/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
        <h3>Parola Sıfırlama Epostası</h3>
        <p> <a href='${resetPasswordUrl}' target='_blank'>Linke</a> tıklayarak parolanızı sıfırlayabilirsiniz,Linkin 1 saatlik bekleme süresini unutmayınız </p>
    `;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: resetEmail,
        subject: 'parola sıfırlama e postası',
        html: emailTemplate
    };
    try {
        sendEmail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'Mail adresinizi kontrol ediniz',
        });
    } catch (err) {
        this.resetPasswordToken = undefined;
        this.resetPasswordExpire = undefined;
        await this.save();
        return next(new CustomError('email gönderilemedi', 500));
    };


});
const resetPassword = asyncWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;
    if (!resetPasswordToken) {
        return next(new CustomError('Şifre sıfırlama linkiniz geçersiz'), 400);
    }
    let user = await userModel.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new CustomError('Şifre sıfırlama linkinizin süresi doldu', 400));
    }
    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({
        success: true,
        message: 'Şifre güncelleme durumu başarılı'
    });
});
const editUser = asyncWrapper(async (req, res, next) => {
    const edits = req.body;
    const user = await userModel.findByIdAndUpdate(req.user.id, edits, {

        new: true,
        runValidators: true
    });
    return res.status(200).json({
        success: true,
        data: user
    });
});
module.exports = {
    authorHome,
    authorRegister,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editUser
}