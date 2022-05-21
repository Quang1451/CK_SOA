var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')
const Account = require('../models/account');

/* GET api all account. */
router.get('/allAccount', check.notLogin, check.isAdmin, function(req, res) {
  Account.find({ role: { "$ne": 'admin' } }, (err, accounts) => {
      if (err) throw err
      res.json(accounts)
  })
});

/* GET api wait account. */
router.get('/waitAccount', check.notLogin, check.isAdmin, function(req, res) {
    Account.find({ role: { "$ne": 'admin' }, verify: ['Chờ xác minh', 'Chờ cập nhật'], lockForever: false }, null,{sort: {createDate: -1, CCCDDdate: -1}},(err, accounts) => {
        if (err) throw err
        res.json(accounts)
    })
});

/* GET api activated account. */
router.get('/activatedAccount', check.notLogin, check.isAdmin, function(req, res) {
    Account.find({ role: { "$ne": 'admin' }, verify: 'Đã xác minh' }, null,{sort: {createDate: -1}},(err, accounts) => {
        if (err) throw err
        res.json(accounts)
    })
});

/* GET api canceled account. */
router.get('/canceledAccount', check.notLogin, check.isAdmin, function(req, res) {
    Account.find({ role: { "$ne": 'admin' }, verify: 'Đã vô hiệu hóa' }, null,{sort: {createDate: -1}},(err, accounts) => {
        if (err) throw err
        res.json(accounts)
    })
});

/* GET api locked account. */
router.get('/lockedAccount', check.notLogin, check.isAdmin, function(req, res) {
    Account.find({ role: { "$ne": 'admin' }, lockForever: true }, null,{sort: {lockTime: -1}},(err, accounts) => {
        if (err) throw err
        res.json(accounts)
    })
});

/* GET api locked account. */
router.get('/accountInfo/:id', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.id)
        return res.json({code: 1})
    var id = req.params.id
    Account.findOne({_id: id},(err, accounts) => {
        if (err) throw err
        res.json({code: 0, user: accounts})
    })
});

module.exports = router;
