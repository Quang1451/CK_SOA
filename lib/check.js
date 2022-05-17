module.exports = {
    login : function(req, res, next) {
        if(req.session.account)
            return res.redirect(303,'/')
        next()
    }
}