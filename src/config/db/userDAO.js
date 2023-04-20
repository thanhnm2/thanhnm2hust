const user = require("../../app/model/user.model");
const { mongooseToObject } = require("../../util/mongoose");
const bcrypt = require("bcryptjs");
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  getAll,
  getById,
  getUserByUserName,
  create,
  update,
  delete: _delete,
  changePassword,
  updateToken,
  logout,
};

async function getAll(filter, limit, page) {
  return await user.find(filter).limit(limit)
    .skip(limit * page);
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await user.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" đã được đăng ký';
  }

  const accountNew = new user(params);
  var result = await accountNew.save();
  return result;
}

async function update(id, params) {
  const result = await getUser(id);
  // validate
  const usernameChanged =
    params.username && result.username !== params.username;
  var validate = await user.findOne({ username: params.username });
  if (usernameChanged && validate) {
    throw 'Username "' + params.username + '" đã được đăng ký';
  }
  var isSuccess = await user.updateOne({ _id: id }, params);
  isSuccess;
}

async function _delete(id) {
  const result = await getUser(id);
  if (result) {
    var isDelete = await user.deleteOne({ _id: id });
    return isDelete;
  }
  return null;
}

async function logout(id) {
  return await user.updateOne({ _id: id }, { token: null });
}

async function updateToken(id, token) {
  console.log(token);
  var isSuccess = await user.updateOne({ _id: id }, { token });
  isSuccess;
}

// helper functions

async function getUser(id) {
  const result = await user.findById(id);
  if (!result) throw "Tài khoản không tồn tại";
  return mongooseToObject(result);
}

async function getUserByUserName(name) {
  return await user.findOne({ username: name });
}

async function changePassword(id, new_password) {
  let password = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10), null);
  const isSuccess = await user.updateOne({ _id: id }, { password });
  isSuccess;
}
