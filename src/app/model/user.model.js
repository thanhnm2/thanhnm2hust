const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Number, default: 1 },
    roleid: { type: Number, default: 1 },
    token: { type: String, required: false },
    uuid: { type: String, required: false },
    is_block: { type: Number, default: 0 },
    avatar: { type: String, required: false },
}, {
    timestamps: true,
},);

// Add plugins
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);