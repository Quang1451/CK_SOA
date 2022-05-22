var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')
const Account = require('../models/account')
const Card = require('../models/card')
const Bill = require('../models/bill')

/* GET users buy Card page. */
router.get('/buyCard', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Mua thẻ cào điện thoại',
  }
  res.render('buyCard', content)
});

/* GET users recharge page. */
router.get('/recharge', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Nạp tiền',
  }
  res.render('recharge', content)
});

/* POST users recharge page. */
router.post('/recharge', check.notLogin, check.isUser, function (req, res) {
  var account = req.session.account
  var { cardId, cardDate, CVV, money } = req.body
  var message
  if (!cardId)
    message = 'Chưa nhập mã thẻ!'
  else if (cardId.length < 6)
    message = 'Mã thẻ không hợp lệ!'
  else if (!cardDate)
    message = 'Chưa nhập ngày hết hạn!'
  else if (!CVV)
    message = 'Chưa nhập CVV!'
  else if (CVV.length < 3)
    message = 'CVV không hợp lệ!'
  else if (!money)
    message = 'Chưa nhập số tiền!'
  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/users/recharge')
  }

  Card.findOne({ id: cardId }, (err, card) => {
    if (err) throw err
  
    if (!card)
      message = 'Thẻ này không được hỗ trợ!'
    else if (card.time.getTime() != new Date(cardDate).getTime())
      message = 'Ngày hết hạn không đúng!'
    else if (card.CVV != CVV)
      message = 'CVV không đúng!'
    else if(card.id == '222222' && parseInt(money) > 1000000)
      message = 'Thẻ này chỉ có thể nạp tối đa là 1 triệu/lần!'
    else if(card.id == '333333')
      message = 'Thẻ đã hết tiền!'
    
    if (message) {
      req.session.message = {
        type: 'danger',
        msg: message
      }
      return res.redirect(303, '/users/recharge')
    }

    Account.updateOne({_id: account._id}, {$set: {money: account.money + parseInt(money)}}, (err, accounts) => {
      if(err) throw err
      account.money = account.money + parseInt(money)
      req.session.account = account

      new Bill({
        userSend: account.username,
        type: 'Nạp tiền',
        money: parseInt(money)
      }).save()

      req.session.message = {
        type: 'success',
        msg: 'Nạp tiền thành công!'
      }
      return res.redirect(303, '/users/recharge')
    })
  })

});

/* GET users withdraw page. */
router.get('/withdraw', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Rút tiền',
  }
  res.render('withdraw', content)
});

/* GET users money transfer page. */
router.get('/moneyTransfer', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Chuyển tiền',
  }
  res.render('moneyTransfer', content)
});

/* GET users transaction history page. */
router.get('/transactionHistory', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Lịch sử giao dịch',
  }
  res.render('transactionHistory', content)
});

/* GET users transaction history page. */
router.get('/optTransfer', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Xác nhận OTP',
  }
  res.render('optTransfer', content)
});
module.exports = router;
