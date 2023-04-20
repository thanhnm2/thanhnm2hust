const express = require('express');
const router = express.Router();
const userController = require('../app/controller/user.controller');
const authMiddleware = require('../middleware/auth.middlewares');
const isAuth = authMiddleware.isAuth;

router.get('/list', isAuth, userController.getAll);
// router.get('/getbyid/:id', userController.getById);
// router.post('/', isAuth, userController.create);
router.put('/update/:id', isAuth, userController.update);
router.delete('/delete/:id', isAuth, userController._delete);
router.put('/change-password', isAuth, userController.changePassword);

module.exports = router;