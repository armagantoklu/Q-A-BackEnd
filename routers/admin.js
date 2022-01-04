const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/author');
const { chechUserExist } = require('../middlewares/database/databaseErrorHelpers');

router.use(getAccessToRoute, getAdminAccess);

router.get('/', adminController.adminHome);
router.get('/block/:id', chechUserExist, adminController.blockUser);
router.delete('/user/remove/:id', chechUserExist, adminController.deleteUser);

module.exports = router;