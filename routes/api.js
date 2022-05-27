var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')
const Account = require('../models/account');
const Bill = require('../models/bill')

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

/* GET api handle activated account. */
router.post('/handleActivated/:username', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.username)
        return res.json({code: 1})
    var username = req.params.username

    Account.updateOne({username: username}, {$set: {verify: 'Đã xác minh'}},(err, accounts) => {
        if (err) throw err
        res.json({code: 0})
    })
});

/* GET api handle send request update account. */
router.post('/handleUpdate/:username', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.username)
        return res.json({code: 1})
    var username = req.params.username

    Account.updateOne({username: username}, {$set: {verify: 'Chờ cập nhật'}},(err, accounts) => {
        if (err) throw err
        res.json({code: 0})
    })
});

/* GET api handle canceled account. */
router.post('/handleCanceled/:username', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.username)
        return res.json({code: 1})
    var username = req.params.username

    Account.updateOne({username: username}, {$set: {verify: 'Đã vô hiệu hóa'}},(err, accounts) => {
        if (err) throw err
        res.json({code: 0})
    })
});

/* GET api handle unlock account. */
router.post('/handleUnlock/:username', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.username)
        return res.json({code: 1})
    var username = req.params.username

    Account.updateOne({username: username}, {$set: {lockForever: false}},(err, accounts) => {
        if (err) throw err
        res.json({code: 0})
    })
});


/* GET api get all bills account. */
router.get('/allBill', check.notLogin, check.isUser, function(req, res) {
    var account = req.session.account
    Bill.find({userSend: account.username}, null,{sort: {time: -1}},(err, bills) => {
        if (err) throw err
        res.json({code: 0, bills: bills})
    })
});

/* GET api get a bill account. */
router.get('/bill/:id', check.notLogin, check.isUser, function(req, res) {
    if(!req.params.id)
        return res.json({code: 1})
    var id = req.params.id
    Bill.findOne({_id: id},(err, bill) => {
        if (err) throw err

        if(bill.type == 'Chuyển tiền') {
            Account.findOne({username: bill.userReceive}, (err, receiver) => {
                return res.json({code: 0, bill: bill, receiver: receiver})
            })
            return
        }
    
        res.json({code: 0, bill: bill})
    })
});

module.exports = router;
