module.exports = {
    login : function(req, res, next) {
        if(req.session.account)
            return res.redirect(303,'/')
        next()
    },

    notLogin: function(req,res,next) {
        if(!req.session.account)
            return res.redirect(303,'/login')
        next()
    },

    isUser: function(req,res,next) {
        var account = req.session.account
        var role = account.role
        if(role != 'user')
            return res.redirect(303,'/')
        next()
    },

    isAdmin: function(req,res,next) {
        var account = req.session.account
        var role = account.role
        if(role != 'admin')
            return res.redirect(303,'/')
        next()
    },
}