var express = require('express');
var router = express.Router();
var check = require('../lib/check.js')
var randomMobileCard = require('../lib/randomMobileCard.js')
var randomOTP = require('../lib/randomOTP')
var sendMail = require('../lib/sendMail')
const Account = require('../models/account')
const Card = require('../models/card')
const Bill = require('../models/bill');
//const bill = require('../models/bill');

/* GET users buy Card page. */
router.get('/buyCard', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Mua thẻ cào điện thoại',
  }
  res.render('buyCard', content)
});

/* POST users buy Card page */
router.post('/buyCard', check.notLogin, check.isUser, function (req, res) {
  var account = req.session.account
  var { type, price, count, fee, money } = req.body
  var fee = fee || 0
  var message

  if (!type)
    message = 'Chưa chọn loại thẻ!'
  else if (!price)
    message = 'Chưa chọn mệnh giá!'
  else if (!price)
    message = 'Chưa nhập số lượng!'

  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/users/buyCard')
  }
  /* Kiểm tra tài khoản có đủ số tiền hay không */
  if (account.money >= parseInt(money)) {
    randomMobileCard.createSeri(type, count, (seri) => {
      Account.updateOne({ _id: account._id }, { $set: { money: account.money - money } }, (err, accounts) => {
        if (err) throw err
        account.money = account.money - money
        req.session.account = account

        var info = { type: type, price: price, count: count, fee: fee, seri: seri }
        var bill = new Bill({
          userSend: account.username,
          type: 'Mua thẻ',
          money: parseInt(money),
          content: JSON.stringify(info)
        })
        bill.save()
        return res.redirect(303, '/users/viewMobileCard/' + bill._id)
      })
    })
  }
  else {
    req.session.message = {
      type: 'danger',
      msg: 'Tài khoản không đủ tiền!'
    }
    return res.redirect(303, '/users/buyCard')
  }
})

/* GET users view mobile card page. */
router.get('/viewMobileCard/:id', check.notLogin, check.isUser, function (req, res) {
  if (!req.params.id)
    return res.redirect(303, '/users/buyCard')

  Bill.findOne({ _id: req.params.id }, (err, bill) => {
    if (bill === undefined)
      return res.redirect(303, '/users/buyCard')

    var info = JSON.parse(bill.content)
    content = {
      layout: 'user.hbs',
      title: 'Xem hóa đơn mua thẻ',
      time: bill.time,
      type: info.type,
      price: info.price,
      count: info.count,
      fee: info.fee,
      seri: info.seri,
      money: bill.money
    }
    res.render('viewMobileCard', content)
  })
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
            verify: 'Đang chờ'
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

/* POST users money transfer page */
router.post('/moneyTransfer', check.notLogin, check.isUser, function (req, res) {
  var account = req.session.account
  var { phoneNumber, money, note, userPayFee } = req.body
  var message
  var sum = parseInt(money)
  
  /* Kiểm tra số tiền ngừi dùng cần trả */
  if(parseInt(userPayFee) == 0)
    sum = sum + (sum * 5 /100)
  
  if (!phoneNumber)
    message = 'Chưa nhập số điện thoại!'
  else if (phoneNumber.length < 10)
    message = 'Số điện thoại không hợp lệ!'
  else if (!money)
    message = 'Chưa nhâp số tiền'
  else if (parseInt(money) < 50000)
    message = 'Số tiền nhở hơn 50,000 đ'
  else if (!userPayFee)
    message = 'Chưa chọn người thanh toán phí giao dịch!'
  else if (account.money < sum)
    message = 'Tài khoản không đủ tiền!'
  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/users/moneyTransfer')
  }
  else {
    Account.findOne({ phoneNumber: phoneNumber }, (err, userReceive) => {
      if (userReceive == undefined) {
        req.session.message = {
          type: 'danger',
          msg: 'Không có số điện thoại này trong hệ thống'
        }
        return res.redirect(303, '/users/moneyTransfer')
      }
      /* Lấy ngẩu nhiên mã otp */
      randomOTP.OTP((otp) => {
        /* Tạo thời gian otp hoạt động */
        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + 3);

        /* Gửi mã OTP */
        sendMail.sendTransferOTP(account.email, otp)

        /* Tạo session lưu các thông tin chuyển tiền */
        req.session.transferMoney = {
          emailReceive: userReceive.email,
          userReceive: userReceive.username,
          moneyReceiveNow: userReceive.money,
          money: parseInt(money),
          note: note,
          whoPayFee: userPayFee,
          otp: otp,
          timeOTP: dt
        }
        res.redirect(303, '/users/otpTransfer')
      })
    })
  }
})

/* GET users transaction history page. */
router.get('/transactionHistory', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Lịch sử giao dịch',
  }
  res.render('transactionHistory', content)
});

/* GET users opt transfer page. */
router.get('/otpTransfer', check.notLogin, check.isUser, function (req, res) {
  content = {
    layout: 'user.hbs',
    title: 'Xác nhận OTP',
  }
  res.render('otpTransfer', content)
});

/* POST user opt transfer page  */
router.post('/otpTransfer', check.notLogin, check.isUser, function (req, res) {
  var account = req.session.account
  var transferMoney = req.session.transferMoney
  var OTP = req.body.OTP
  var message
  if (!OTP)
    message = 'Chưa nhập mã OTP!'
  else if (OTP.length < 6)
    message = 'Mã OTP không hợp lệ!'
  else if (transferMoney.otp != OTP || new Date(transferMoney.timeOTP) < new Date())
    message = 'Mã OTP không chính xác!'

  if (message) {
    delete req.session.transferMoney
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/users/moneyTransfer')
  }

  /* Kiểm tra số tiền nhỏ hơn năm triệu */
  if (transferMoney.money < 5000000) {
    var fee = transferMoney.money * 5 / 100
    var update, moneyReceive

    /* Kiểm tra ai là người trả phí giao dịch và cập nhật lại các số tiền thay đổi */
    switch (transferMoney.whoPayFee) {
      case '1':
        update = { $set: { money: account.money - transferMoney.money } }
        account.money = account.money - transferMoney.money
        moneyReceive = transferMoney.money - fee
        break;
      default:
        update = { $set: { money: account.money - transferMoney.money - fee } }
        account.money = account.money - transferMoney.money - fee
        moneyReceive = transferMoney.money
        break;
    }

    /* Cập nhật lại số tiền của người gửi */
    Account.updateOne({ _id: account._id }, update, (err, accounts) => {
      if (err) throw err
      req.session.account = account
    })
    /* cập nhật lại số tiền của người nhận */
    Account.updateOne({ username: transferMoney.userReceive }, { $set: { money: transferMoney.moneyReceiveNow + moneyReceive } }, (err, r) => {
      if (err) throw err
    })

    /* Tạo hóa đơn chuyển tiền thành công */
    new Bill({
      userSend: account.username,
      userReceive: transferMoney.userReceive,
      type: 'Chuyển tiền',
      money: transferMoney.money,
      content: JSON.stringify({ whoPayFee: transferMoney.whoPayFee, note: transferMoney.note })
    }).save()

    /* Gửi mail chuyển tiền */
    sendMail.sendTransferMoney(transferMoney.emailReceive, moneyReceive, fee, transferMoney.whoPayFee, account.username, transferMoney.note)

    /* Gửi thông báo chuyển tiền thành công */
    req.session.message = {
      type: 'success',
      msg: 'Chuyển tiền thành công!'
    }
    return res.redirect(303, '/users/moneyTransfer')
  }
  /* Số tiền lớn hơn 5 triệu */
  else {
    /* Tạo khóa đơn duyệt rút tiền */
    new Bill({
      userSend: account.username,
      userReceive: transferMoney.userReceive,
      type: 'Chuyển tiền',
      money: transferMoney.money,
      content: JSON.stringify({ whoPayFee: transferMoney.whoPayFee, note: transferMoney.note }),
      verify: 'Đang chờ'
    }).save()

    req.session.message = {
      type: 'success',
      msg: 'Số tiền lớn hơn 5 triệu đồng phải đợi admin duyệt!'
    }
    return res.redirect(303, '/users/moneyTransfer')
  }
})
module.exports = router;
