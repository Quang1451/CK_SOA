var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')

const Account = require('../models/account.js');

/* GET management account page */
router.get('/managementAccount', check.notLogin, check.isAdmin ,function(req, res) {
    content = {
      layout: 'admin.hbs',
      title: 'Quản lý tài khoản',
    }
    res.render('managementAccount', content)
});

/* GET management transaction page */
/*router.get('/managementTransaction', check.notLogin, check.isAdmin ,function(req, res) {
    content = {
      layout: 'admin.hbs',
      title: 'Quản lý các giao dịch',
    }
    res.render('managementTransaction', content)
});*/

module.exports = router;
