var Account = require('../models/account.js')

module.exports = {
    OTP : function(cb) {
        var otp = Math.floor(Math.random() * 1000000).toString()
        while (otp.length < 6) {
            otp = '0' + otp;
        }
        Account.find({otp: otp}, function(err, result) {
            if (err) throw err
            if (!result) 
                return OTP()
            return cb(otp)
        })       
    },
}