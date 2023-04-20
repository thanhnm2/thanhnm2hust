const express = require('express');
const router = express.Router();
const authController = require('../app/controller/auth.controller');
const authMiddleware = require("../middleware/auth.middlewares");
const isAuth = authMiddleware.isAuth;

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/logout',isAuth, authController.logout);
router.get('/info', isAuth, authController.info);

module.exports = router;