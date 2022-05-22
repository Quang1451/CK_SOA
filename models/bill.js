const mongoose = require('mongoose')

const billSchema = mongoose.Schema({
    userSend: String,
    userReceive: String,
    type: String,
    time: {type: Date, default: new Date()},
    content: {type: String, default: ''},
    money: Number,
})

const bill = mongoose.model('Bill', billSchema)
module.exports = bill