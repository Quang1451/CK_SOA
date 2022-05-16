const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
    userId: String,
    money: Number
})

const wallet = mongoose.model('Wallet', walletSchema)
module.exports = wallet