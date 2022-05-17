const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    phoneNumber: String,
    email: String,
    name: String,
    birthday: Date,
    address: String,
    front_CCCD: String,
    back_CCCD: String,
    username: String,
    password: String,
    role: {type: String, default: 'user'},
    changePassword: {type: Boolean, default: true},
    verify: {type: String, default: 'Chờ xác minh'},
    failTimes: {type: Number, default: 0},
    lockTime: Date,
    lockForever: {type: Boolean, default: false},
    message: String,
    money: {type: Number, default: 10000000}
})

const account = mongoose.model('Account', accountSchema)
module.exports = account