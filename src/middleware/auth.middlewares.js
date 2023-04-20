const jwtVariable = require('../util/jwt');
const userService = require('../config/db/userDAO');
const authMethod = require('../util/auth.methods');

exports.isAuth = async (req, res, next) => {
    // Lấy access token
    const token = req.query.token;
    if (!token) {
        return res.status(401).send('Không tìm thấy access token!');
    }

    const accessTokenSecret =
        "Access_Token_Secret_#$%_ExpressJS_Authentication" || jwtVariable.accessTokenSecret;

    const verified = await authMethod.verifyToken(
        token,
        accessTokenSecret,
    );
    if (!verified) {
        return res
            .status(401)
            .send('Bạn không có quyền truy cập vào tính năng này!');
    }

    const user = await userService.getById(verified.payload.id);
    req.user = user;
    return next();
};