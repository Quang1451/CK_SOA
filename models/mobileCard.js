const mongoose = require('mongoose')

const mobileCardSchema = mongoose.Schema({
    name: String,
    id: String,
})

const mobileCard = mongoose.model('MobileCard', mobileCardSchema)
module.exports = mobileCard