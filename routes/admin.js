var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')

const Account = require('../models/account.js');

/* GET users listing. */
router.get('/managementAccount', check.notLogin, check.isAdmin ,function(req, res) {
    content = {
      layout: 'admin.hbs',
      title: 'Quản lý tài khoản',
    }
    res.render('managementAccount', content)
});

module.exports = router;
