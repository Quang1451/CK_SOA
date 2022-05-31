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
router.get('/bill/:id', check.notLogin, function(req, res) {
    if(!req.params.id)
        return res.json({code: 1})
    var id = req.params.id
    Bill.findOne({_id: id},(err, bill) => {
        if (err) throw err
        console.log(bill)
        
        if(bill.type == 'Chuyển tiền') {
            Account.findOne({username: bill.userReceive}, (err, receiver) => {
                return res.json({code: 0, bill: bill, receiver: receiver})
            })
            return 
        }
    
        res.json({code: 0, bill: bill})
    })
});

/* GET api approve gte 5m bill request. */
router.post('/appr/:id', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.id)
        return res.json({code: 1})
    var id = req.params.id
    var username
    

    Bill.findOne({_id:id},(err,bill) => {
        if (err) throw err
        username = bill.userSend
        console.log(username)
        if (bill.type === 'Rút tiền'){
            var fee = parseInt(bill.money) * 5 / 100
            var sum = parseInt(bill.money) + fee
            Account.findOne({username: username},(err,account) => {
                if (err) throw err
                console.log(account)
                /* Kiểm tra tài khoản có đủ tiền không */
                if (account.money >= sum) {
                        Account.updateOne({ _id: account._id }, { $set: { money: account.money - sum } }, (err) => {
                            if (err) throw err
                            Bill.updateOne({_id: id}, {$set: {verify: 'Đã duyệt'}},(err) => {
                                if (err) throw err
                                return res.json({code: 0})
                            })
                        })
                }
                else {
                    return res.json({code: 1})
                }
            })
        }
        else if (bill.type === 'Chuyển tiền'){
            var fee = bill.money * 5 / 100
            var update, moneyReceive

            /* Kiểm tra ai là người trả phí giao dịch và cập nhật lại các số tiền thay đổi */
            switch (bill.whoPayFee) {
            case '1':
                update = { $set: { money: account.money - bill.money } }
                account.money = account.money - transferMoney.money
                moneyReceive = bill.money - fee
                break;
            default:
                update = { $set: { money: account.money - bill.money - fee } }
                account.money = account.money - bill.money - fee
                moneyReceive = bill.money
                break;
            }

            /* Cập nhật lại số tiền của người gửi */
            Account.updateOne({ _id: account._id }, update, (err) => {
            if (err) throw err
            })
            /* cập nhật lại số tiền của người nhận */
            Account.updateOne({ username: bill.userReceive }, { $set: { money: bill.moneyReceiveNow + moneyReceive } }, (err) => {
            if (err) throw err
            })

            /* Gửi mail chuyển tiền */
            sendMail.sendTransferMoney(bill.emailReceive, moneyReceive, fee, bill.whoPayFee, account.username, bill.note)

            /* Gửi thông báo chuyển tiền thành công */
            return res.json({code: 0})
        }
    })
});

/* GET api reject gte 5m bill request. */
router.post('/rej/:id', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.id)
        return res.json({code: 1})
    var id = req.params.id

    Bill.updateOne({_id: id}, {$set: {verify: 'Từ chối'}},(err) => {
        if (err) throw err
        res.json({code: 0})
    })
});

/* GET api get all bill bigger than 5m. */
router.get('/listBill', check.notLogin, check.isAdmin, function(req, res) {
    //db.collection_name.find({< key > : {$gte : < value >}}) 
    Bill.find({money: {$gte : 5000000}, verify: 'Đang chờ'}, null,{sort: {time: -1}},(err, bills) => {
        if (err) throw err
        res.json({code: 0, bills: bills})
    })
})

/* GET api get all bill bigger than 5m. */
router.get('/accountName/:user', check.notLogin, check.isAdmin, function(req, res) {
    if(!req.params.user)
        return res.json({code: 1})
    var user = req.params.user
    Account.findOne({username: user},(err, accounts) => {
        if (err) throw err
        res.json({code: 0, accountName: accounts.name})
    })
})
module.exports = router;
