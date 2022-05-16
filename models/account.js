const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    phoneNumber: String,
    email: String,
    name: String,
    birthday: Date,
    address: String,
    avatar: [String],
    username: String,
    password: String,
    role: String,
    changePassword: Boolean,
    verify: String,
    FailTimes: Number,
    lockTime: String,
    message: String,
})

const account = mongoose.model('Account', accountSchema)
module.exports = account