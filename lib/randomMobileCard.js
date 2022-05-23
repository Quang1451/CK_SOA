var MobileCard = require('../models/mobileCard')


module.exports = {
    createSeri: function (nameCard, count, cb) {
        MobileCard.findOne({ name: nameCard }, function (err, card) {
            if (err) throw err
            if (card) {
                var seriArray = []
                for (var i = 0; i < count; i++) {
                    var seri = Math.floor(Math.random() * 10000).toString()
                    while (seri.length < 4) {
                        seri = '0' + seri;
                    }
                    seriArray.push(card.id + seri)
                }
                return cb(seriArray)
            }
            cb('')
        })
    },
}