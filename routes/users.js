var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')


/* GET users buy Card page. */
router.get('/buyCard',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Mua thẻ cào điện thoại',
  }
  res.render('buyCard', content)
});

/* GET users recharge page. */
router.get('/recharge',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Nạp tiền',
  }
  res.render('recharge', content)
});

/* GET users withdraw page. */
router.get('/withdraw',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Rút tiền',
  }
  res.render('withdraw', content)
});

/* GET users money transfer page. */
router.get('/moneyTransfer',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Chuyển tiền',
  }
  res.render('moneyTransfer', content)
});

/* GET users transaction history page. */
router.get('/transactionHistory',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Lịch sử giao dịch',
  }
  res.render('transactionHistory', content)
});

/* GET users transaction history page. */
router.get('/optTransfer',check.notLogin, check.isUser, function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Xác nhận OTP',
  }
  res.render('optTransfer', content)
});
module.exports = router;
