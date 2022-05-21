var express = require('express');
var router = express.Router();

/* GET users buy Card page. */
router.get('/buyCard', function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Mua thẻ cào điện thoại',
  }
  res.render('buyCard', content)
});

/* GET users recharge page. */
router.get('/recharge', function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Nạp tiền',
  }
  res.render('recharge', content)
});

/* GET users withdraw page. */
router.get('/withdraw', function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Rút tiền',
  }
  res.render('withdraw', content)
});

/* GET users money transfer page. */
router.get('/moneyTransfer', function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Chuyển tiền',
  }
  res.render('moneyTransfer', content)
});

/* GET users transaction history page. */
router.get('/transactionHistory', function(req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Lịch sử giao dịch',
  }
  res.render('transactionHistory', content)
});
module.exports = router;
