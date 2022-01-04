const userModel = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncWrapper = require("express-async-handler");
const adminHome = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'admin home page'
    });
};
const blockUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    user.blocked = !user.blocked;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Bloklama veya Unblok işlemi başarıyla yapıldı'
    });

});
const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    
    await user.remove();//user modelde questionModel ile ilgili yazdığımız method direk burada çalışacak 
    //post dedipimiz için diğer fonksiynda önce sildi burayı sonra o kullanıcının oluşturduğu bütün soruları sildi

    res.status(200).json({
        success: true,
        message: 'Silme işlemi başarıyla yapıldı'
    });

});
module.exports = {
    adminHome,
    blockUser,
    deleteUser
}