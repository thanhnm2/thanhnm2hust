const bcrypt = require("bcryptjs");
const validateRequest = require("../../middleware/validate-request");
const userService = require("../../config/db/userDAO");
const authMethod = require("../../util/auth.methods");
const randToken = require("rand-token");
const jwtVariable = require("../../util/jwt");
const BaseResponseModel = require("../../common/BaseResponseModel");

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  const user = await userService.getUserByUserName(username);
  if (user) res.status(409).send("Tên tài khoản đã tồn tại.");
  else {
    const hashPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10),
      null
    );
    const newUser = {
      username,
      password: hashPassword,
      email,
      roleid: 0,
    };
    const createUser = await userService.create(newUser);
    if (!createUser) {
      return res
        .status(400)
        .send(
          BaseResponseModel.notFound(
            "Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại."
          )
        );
    }
    return res
      .status(200)
      .send(BaseResponseModel.withSuccess(null, createUser));
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUserByUserName(username);
  if (!user) {
    return res
      .status(400)
      .send(BaseResponseModel.notFound("Tài khoản không chính xác."));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .send(BaseResponseModel.notFound("Mật khẩu không chính xác."));
  }

  const accessTokenLife = "1000000h";
  const accessTokenSecret = "Access_Token_Secret_#$%_ExpressJS_Authentication";

  const dataForAccessToken = {
    username,
    id: user._id,
    roleid: user.roleid,
  };
  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res
      .status(401)
      .send("Đăng nhập không thành công, vui lòng thử lại.");
  }

  let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
  // if (!user.refreshToken) {
  //     // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
  //     await authMethod.updateRefreshToken(user.username, refreshToken);
  // } else {
  //     // Nếu user này đã có refresh token thì lấy refresh token đó từ database
  //     refreshToken = user.refreshToken;
  // }

  const result = {
    id: user._id,
    token: user.token,
    username: user.username,
    avatar: user.avatar,
    is_block: user.is_block,
  };

  await userService.updateToken({ _id: user._id }, accessToken);
  return res.status(200).send(BaseResponseModel.withSuccess(null, result));
};

exports.info = async (req, res) => {
  return res.status(200).send(BaseResponseModel.withSuccess(null, req.user));
};

exports.logout = async (req, res) => {
  const user = req.user;
  try {
    await userService.logout(user._id)
      .then(() => res.status(200).json(BaseResponseModel.withSuccess()));
  } catch (error) {}
};
