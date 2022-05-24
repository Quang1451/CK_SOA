var Account = require('../models/account.js')
var otpGenerator = require('otp-generator')

module.exports = {
    OTP : function(cb) {
        var otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });
        Account.find({otp: otp}, function(err, result) {
            if (err) throw err
            if (!result) 
                return OTP()
            
            //Store OTP to database
            return cb(otp)
        })
    },
}