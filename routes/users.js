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

  /* Kiểm tra thông tin của thẻ */
  Card.findOne({ id: cardId }, (err, card) => {
    if (err) throw err

    if (!card)
      message = 'Thẻ này không được hỗ trợ!'
    else if (card.time.getTime() != new Date(cardDate).getTime())
      message = 'Ngày hết hạn không đúng!'
    else if (card.CVV != CVV)
      message = 'CVV không đúng!'
    else if (card.id == '222222' && parseInt(money) > 1000000)
      message = 'Thẻ này chỉ có thể nạp tối đa là 1 triệu/lần!'
    else if (card.id == '333333')
      message = 'Thẻ đã hết tiền!'

    if (message) {
      req.session.message = {
        type: 'danger',
        msg: message
      }
      return res.redirect(303, '/users/recharge')
    }

    /* Lưu số tiền nạp vào tài khoản */
    Account.updateOne({ _id: account._id }, { $set: { money: account.money + parseInt(money) } }, (err, accounts) => {
      if (err) throw err
      account.money = account.money + parseInt(money)
      req.session.account = account
      /* Tạo hóa đơn giao dịch và thông báo cho người dùng */
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

/* POST users withdraw page. */
router.post('/withdraw', check.notLogin, check.isUser, function (req, res) {
  var account = req.session.account
  var { cardId, cardDate, CVV, money, note } = req.body
  var fee = parseInt(money) * 5 / 100
  var sum = parseInt(money) + fee

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
    return res.redirect(303, '/users/withdraw')
  }
  /* Kiểm tra thông tin của thẻ */
  Card.findOne({ id: cardId }, (err, card) => {
    if (err) throw err
    if (!card)
      message = 'Thẻ này không được hỗ trợ rút tiền!'
    else if (card.time.getTime() != new Date(cardDate).getTime())
      message = 'Ngày hết hạn không đúng!'
    else if (card.CVV != CVV)
      message = 'CVV không đúng!'

    if (message) {
      req.session.message = {
        type: 'danger',
        msg: message
      }
      return res.redirect(303, '/users/withdraw')
    }
    /* Lấy thời gian bắt đầu của ngày hiện tại */
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    /* Lấy thời gian kết thúc của ngày hiện tại */
    var end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    /* Kiểm tra tài khoản còn số lần rút trong ngày hay không */
    Bill.find({ userSend: account.username, type: 'Rút tiền', time: { "$gte": start, "$lt": end } }, (err, bills) => {
      if (bills.length >= 2) {
        req.session.message = {
          type: 'danger',
          msg: 'Tài khoản đã hết lượt rút tiền trong ngày hôm nay'
        }
        return res.redirect(303, '/users/withdraw')
      }
      /* Kiểm tra tài khoản có đủ tiền không */
      if (account.money >= sum) {
        /* Kiểm tra số tiền có nhở hơn 5 triệu không */
        if (parseInt(money) < 5000000) {
          Account.updateOne({ _id: account._id }, { $set: { money: account.money - sum } }, (err, accounts) => {
            if (err) throw err
            account.money = account.money - sum
            req.session.account = account
            /* Tạo hóa đơn rút tiền thành công */
            new Bill({
              userSend: account.username,
              type: 'Rút tiền',
              money: parseInt(money),
              content: note
            }).save()
  
            req.session.message = {
              type: 'success',
              msg: 'Rút tiền thành công!'
            }
            return res.redirect(303, '/users/withdraw')
          })
        }
        /* Trường hợp số tiền lớn hơn 5 triệu */
        else {
          /* Tạo khóa đơn duyệt rút tiền */
          new Bill({
            userSend: account.username,
            type: 'Rút tiền',
            money: parseInt(money),
            content: note,
            verify: 'Chờ duyệt'
          }).save()
  
          req.session.message = {
            type: 'success',
            msg: 'Số tiền lớn hơn 5 triệu đồng phải đợi admin duyệt!'
          }
          return res.redirect(303, '/users/withdraw')
        }
      }
      else {
        req.session.message = {
          type: 'danger',
          msg: 'Số tiền lớn hơn số dư tài khoản!'
        }
        return res.redirect(303, '/users/withdraw')
      }
    })
  })

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
