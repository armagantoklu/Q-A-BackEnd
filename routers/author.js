const express = require("express");
const router = express.Router();
const authorController = require("../controller/author");
const {getAccessToRoute} = require("../middlewares/authorization/author");
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

router.get("/", authorController.authorHome);
router.post("/register", authorController.authorRegister);
router.get("/profile", getAccessToRoute, authorController.getUser);
router.post("/login", authorController.login);
router.get('/logout', getAccessToRoute, authorController.logout);
router.post('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], authorController.imageUpload);
router.post('/forgotpassword',authorController.forgotPassword);
router.put('/resetpassword',authorController.resetPassword);
router.put('/edit',getAccessToRoute,authorController.editUser);

module.exports = router;

