module.exports = {
    /* Kiểm tra tài khoản không được phép vào trang login và register khi đã đăng nhập và quay lai trang chủ */
    login: function (req, res, next) {
        if (req.session.account)
            return res.redirect(303, '/')
        next()
    },

    /* Kiểm tra tài khoản chưa đăng nhập không được phép dùng api và các chức năng */
    notLogin: function (req, res, next) {
        if (!req.session.account)
            return res.redirect(303, '/login')
        next()
    },

    /* Kiểm tra tài khoản có phải là user hay không */
    isUser: function (req, res, next) {
        var account = req.session.account
        var role = account.role
        if (role != 'user')
            return res.redirect(303, '/')
        next()
    },

    /* Kiểm tra tài khoản có phải là admin hay không */
    isAdmin: function (req, res, next) {
        var account = req.session.account
        var role = account.role
        if (role != 'admin')
            return res.redirect(303, '/')
        next()
    },

    /* Trả về layout tương ứng với quyền hạng */
    getLayout: function (role) {
        var layout = 'user.hbs'
        if (role == 'admin')
            layout = 'admin.hbs'
        return layout
    },

    firstLogin: function(req,res, next) {
        var account = req.session.account
        if(account.changePassword)
            return res.redirect(303,'/firstLogin')
        next()
    }
}