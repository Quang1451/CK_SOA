const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    idCard: String,
    time: Date,
    CVV: String,
    note: String
})

const card = mongoose.model('Card', cardSchema)
module.exports = card