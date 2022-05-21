var Account = require('../models/account.js')


module.exports = {
    createUsername : function(cb) {
        var username = Math.floor(Math.random() * 10000000000).toString()
        while (username.length < 10) {
          username = '0' + username;
        }
        Account.find({username: username}, function(err, account) {
            if (err) throw err
            if (account.length) 
                return createUsername()
            return cb(username)
        })
    },

    createPassword : function () {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var password = ''
        for (var i = 0; i < 6; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          password += chars.substring(rnum, rnum + 1);
        }
        return password
    }
}