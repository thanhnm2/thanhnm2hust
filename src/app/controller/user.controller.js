const Joi = require('joi');
const validateRequest = require('../../middleware/validate-request');
const BaseResponseModel = require("../../common/BaseResponseModel");
const userService = require('../../config/db/userDAO');

// route functions
async function getAll(req, res, next) {
    const limit = 5;
    const query = req.query.search;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    const filter = query ? { username: query } : {};

    const data = await userService.getAll(filter, limit, page)
    console.log(data);
    return res.status(200)
        .send(BaseResponseModel.withSuccess(null, { users: data, count: data ? data.length : limit, page: page + 1 }))
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({
            message: 'Thêm mới thành công',
            status: true
        }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({
            message: 'Cập nhập thành công',
            status: true
        }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json(
            {
                message: 'Xóa thành công',
                status: true
            }))
        .catch(next);
}

function changePassword(req, res, next) {
    const { _id } = req.user;
    const { new_password } = req.body;
    userService.changePassword(_id, new_password)
        .then(() => res.json(
            {
                message: 'Thành công',
                status: true
            }))
        .catch(next);
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    _delete,
    changePassword
};
