var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var validator = require('email-validator');
var bcrypt = require('bcrypt');
var fs = require('fs')
var path = require('path')
var check = require('../lib/check.js')
var randomAccount = require('../lib/randomAccount.js')
var sendMail = require('../lib/sendMail.js')

const Account = require('../models/account.js');
const randomOTP = require('../lib/randomOTP.js');
const { Console } = require('console');

/* GET home page. */
router.get('/', check.notLogin, check.firstLogin, function (req, res) {
  var account = req.session.account
  var role = account.role

  content = {
    layout: check.getLayout(role),
    title: 'Home',
  }
  res.render('index', content)
})

/* GET first login page */
router.get('/firstLogin', check.notLogin, function (req, res) {
  content = {
    title: 'Đăng nhập lần đầu tiên',
  }
  res.render('firstLogin', content);
})

/* POST first login page */
router.post('/firstLogin', check.notLogin, function (req, res) {
  var account = req.session.account
  var id = account._id
  var { newPass, reNewPass } = req.body

  var message
  if (!newPass)
    message = 'Chưa nhập mật khẩu mới!'
  else if (!reNewPass)
    message = 'Chưa nhập xác nhận mật khẩu!'
  else if (newPass.length < 6)
    message = 'Mật khẩu ít hơn 6 ký tự!'
  else if (reNewPass != newPass)
    message = 'Mật khẩu nhập lại không đúng!'

  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/firstLogin')
  }

  var hashpasssword = bcrypt.hashSync(newPass, 10);

  Account.updateOne({ _id: id }, { $set: { password: hashpasssword, changePassword: false } }, (err, accounts) => {
    if (err) throw err

    account.changePassword = false
    req.session.account = account

    res.redirect(303, '/')
  })
})

/* GET change password page */
router.get('/changePassword', check.notLogin, check.firstLogin, function (req, res) {
  var account = req.session.account
  var role = account.role

  content = {
    layout: check.getLayout(role),
    title: 'Change Password',
  }
  res.render('changePassword', content)
})

/* POST change password page */
router.post('/changePassword', function (req, res) {
  var account = req.session.account
  var id = account._id

  var { oldPass, newPass, reNewPass } = req.body

  var message
  if (!oldPass)
    message = 'Chưa nhập mật khẩu cũ!'
  else if (!newPass)
    message = 'Chưa nhập mật khẩu mới!'
  else if (!reNewPass)
    message = 'Chưa nhập xác nhận!'
  else if (newPass.length < 6)
    message = 'Mật khẩu ít hơn 6 ký tự!'
  else if (reNewPass != newPass)
    message = 'Mật khẩu nhập lại không đúng!'

  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/changePassword')
  }

  Account.findOne({ _id: id }, (err, result) => {
    if (err) throw err

    if (!bcrypt.compareSync(oldPass, result.password)) {
      req.session.message = {
        type: 'danger',
        msg: 'Mật khẩu cũ không chính xác'
      }
      return res.redirect(303, '/changePassword')
    }
  })

  var hashpasssword = bcrypt.hashSync(newPass, 10);

  Account.updateOne({ _id: id }, { $set: { password: hashpasssword } }, (err, accounts) => {
    if (err) throw err

    res.redirect(303, '/')
  })
})

/* GET profile page. */
router.get('/profile/:id', check.notLogin, check.firstLogin, function (req, res) {
  var id = req.params.id

  var account = req.session.account
  var role = account.role
  /* Tìm kiểm bởi id trong mongodb */
  Account.findOne({ _id: id }, function (err, profile) {
    if (profile === undefined)
      return res.redirect(303, '/')

    content = {
      layout: check.getLayout(role),
      title: 'Profile',
      name: profile.name,
      phone: profile.phoneNumber,
      email: profile.email,
      address: profile.address,
      birthday: profile.birthday,
      verify: profile.verify,
      backCCCD: profile.back_CCCD,
      frontCCCD: profile.front_CCCD,
      money: profile.money
    }
    res.render('profile', content)
  })
})

/* GET update CCCD page */
router.get('/updateCCCD', check.notLogin, check.firstLogin, function (req, res) {
  var account = req.session.account
  var role = account.role

  content = {
    layout: check.getLayout(role),
    title: 'Thay đổi CCCD',
  }
  res.render('updateCCCD', content)
})

/* POST update CCCD page */
router.post('/updateCCCD', function (req, res) {
  var account = req.session.account
  var id = account._id
  var form = new multiparty.Form()
  form.parse(req, function (err, fields, files) {
    if (err) throw err

    var front_CCCD = files.frontCCCD[0]
    var back_CCCD = files.backCCCD[0]

    var message
    if (!front_CCCD)
      message = 'Thiếu hình ảnh mặt trước CCCD'
    else if (!back_CCCD)
      message = 'Thiếu hình ảnh mặt trước CCCD'

    if (message) {
      req.session.message = {
        type: 'danger',
        msg: message
      }
      return res.redirect(303, '/updateCCCD')
    }

    var root = __dirname.replace(path.basename(__dirname), '')
    var dir = path.join(root, 'public', 'images', 'CCCD')
    var newFrontCCCD = path.join(dir, 'front_' + account.phoneNumber + '.jpg')
    var newBackCCCD = path.join(dir, 'back_' + account.phoneNumber + '.jpg')

    console.log(dir)
    console.log(newFrontCCCD)
    console.log(newBackCCCD)

    if (!fs.existsSync(dir))
      fs.mkdirSync(dir)

    /* Lưu hình ảnh mặt trước CCCD */
    fs.rename(front_CCCD.path, newFrontCCCD, (err) => {
      if (err)
        console.log(err.message)
      else
        console.log('Lưu hình ảnh mặt trước CCCD thành công!')
    })

    /* Lưu hình ảnh mặt sau CCCD */
    fs.rename(back_CCCD.path, newBackCCCD, (err) => {
      if (err)
        console.log(err.message)
      else
        console.log('Lưu hình ảnh mặt sau CCCD thành công!')
    })
    Account.updateOne({_id: id},{$set: {CCCDDate: new Date()}}, (err, data) => {
      account.CCCDDate = data.CCCDDate
    })
    req.session.account = account
    res.redirect(303, '/')
  })
})

/* GET login page. */
router.get('/login', check.login, function (req, res) {

  content = {
    title: 'Login',
  }
  res.render('login', content);
});

/* POST login page. */
router.post('/login', function (req, res) {
  var { username, password } = req.body
  var message
  if (!username)
    message = 'Chưa nhập username!'
  else if (!password)
    message = 'Chưa nhập password!'
  else if (password.length < 6)
    message = 'Password ít nhất phải có 6 ký tự!'

  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/login')
  }

  Account.findOne({ username: username }, (err, account) => {
    if (err) throw err

    if (!account) {
      req.session.message = {
        type: 'danger',
        msg: 'Tài khoản không tồn tài!'
      }
      return res.redirect(303, '/login')
    }

    /* Thông báo account bị vô hiệu hóa */
    if (account.verify == 'Đã vô hiệu hóa') {
      req.session.message = {
        type: 'danger',
        msg: 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008'
      }
      return res.redirect(303, '/login')
    }

    /* Khóa tạm thời vĩnh viễn */
    if (account.lockForever) {
      req.session.message = {
        type: 'danger',
        msg: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'
      }
      return res.redirect(303, '/login')
    }
    /* Khóa tạm thời 1 phút */
    else if (account.lockTime >= new Date()) {
      req.session.message = {
        type: 'danger',
        msg: 'Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút'
      }
      return res.redirect(303, '/login')
    }

    /* Kiểm tra đúng mật khẩu */
    if (bcrypt.compareSync(password, account.password)) {
      Account.updateOne({ username: username }, { $set: { failTimes: 0 } }, (err) => {
        if (err) throw err
      })
      req.session.account = account
      return res.redirect(303, '/')
    }

    /* Kiểm tra sai mật khẩu của user */
    if (account.role === 'user') {
      var update
      var timeErr = account.failTimes + 1

      switch (timeErr) {
        case 3:
          var dt = new Date();
          dt.setMinutes(dt.getMinutes() + 1);
          update = { $set: { failTimes: timeErr, lockTime: dt, message: '1 lần đăng nhập bất thường'}}
          break
        case 6:
          update = { $set: { failTimes: timeErr, lockForever: true, message: '1 lần đăng nhập bất thường', lockTime: new Date() } }
          break
        default:
          update = { $set: { failTimes: timeErr } }
          break
      }

      Account.updateOne({ username: username }, update, (err) => {
        if (err) throw err

        req.session.message = {
          type: 'danger',
          msg: 'Sai mật khẩu!'
        }
        return res.redirect(303, '/login')
      })
    }
    else {
      req.session.message = {
        type: 'danger',
        msg: 'Sai mật khẩu!'
      }
      res.redirect(303, '/login')
    }
  })
})

/* GET register page. */
router.get('/register', check.login, function (req, res) {

  content = {
    title: 'Register',
  }
  res.render('register', content);
});

/* POST register page. */
router.post('/register', function (req, res) {
  var form = new multiparty.Form()
  form.parse(req, function (err, fields, files) {
    if (err) throw err

    var { phone, email, name, birthday, address } = fields
    var { frontCCCD, backCCCD } = files

    var message
    if (!phone[0])
      message = 'Thiếu số điện thoại!'
    else if (phone[0].length != 10)
      message = 'Số điện thoại không hợp lệ!'
    else if (!email[0])
      message = 'Thiếu email!'
    else if (!validator.validate(email[0]))
      message = 'Email không hợp lệ!'
    else if (!name[0])
      message = 'Thiếu họ và tên!'
    else if (!birthday[0])
      message = 'Thiếu ngày sinh!'
    else if (!address[0])
      message = 'Thiếu địa chỉ!'
    else if (!frontCCCD[0])
      message = 'Thiếu hình ảnh mặt trước CCCD'
    else if (!backCCCD[0])
      message = 'Thiếu hình ảnh mặt trước CCCD'

    if (message) {
      req.session.message = {
        type: 'danger',
        msg: message
      }
      return res.redirect(303, '/register')
    }
    else {
      Account.find({ $or: [{ 'phoneNumber': phone }, { 'email': email }] }, (err, accounts) => {
        if (err) throw err

        if (accounts.length) {
          req.session.message = {
            type: 'danger',
            msg: 'Số điện thoại hoặc email đã tồn tại!'
          }
          return res.redirect(303, '/register')
        }

        /* Kiểm tra thư mục CCCD */
        var root = __dirname.replace(path.basename(__dirname), '')
        var dir = path.join(root, 'public', 'images', 'CCCD')
        var newFrontCCCD = path.join(dir, 'front_' + phone[0] + '.jpg')
        var newBackCCCD = path.join(dir, 'back_' + phone[0] + '.jpg')

        if (!fs.existsSync(dir))
          fs.mkdirSync(dir)

        /* Lưu hình ảnh mặt trước CCCD */
        fs.rename(frontCCCD[0].path, newFrontCCCD, (err) => {
          if (err)
            console.log(err.message)
          else
            console.log('Lưu hình ảnh mặt trước CCCD thành công!')
        })

        /* Lưu hình ảnh mặt sau CCCD */
        fs.rename(backCCCD[0].path, newBackCCCD, (err) => {
          if (err)
            console.log(err.message)
          else
            console.log('Lưu hình ảnh mặt sau CCCD thành công!')
        })

        /* Ngẫu nhiên username */
        randomAccount.createUsername((data) => {
          var username = data
          /* Ngẫu nhiên password */
          var password = randomAccount.createPassword()

          var hashpasssword = bcrypt.hashSync(password, 10);
          new Account({
            phoneNumber: phone[0],
            email: email[0],
            name: name[0],
            birthday: birthday[0],
            address: address[0],
            username: username,
            password: hashpasssword,
            lockTime: new Date(),
            front_CCCD: path.basename(newFrontCCCD),
            back_CCCD: path.basename(newBackCCCD)
          }).save()
          /* Tiến hành gửi mail */
          sendMail.sendAccount(email, username, password)

          res.redirect(303, '/login')
        })
      })
    }
  });
})

/* GET logout page. */
router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect(303, '/login')
})

/* GET forget password page. */
router.get('/forgetPassword', check.login, function (req, res) {
  content = {
    title: 'Quên mật khẩu',
  }
  res.render('forgetPassword', content);
});

/* POST forget passsword page. */
router.post('/forgetPassword', function (req, res) {
  var { email, phone } = req.body
  var message
  if (!email) {
    message = 'Chưa nhập email!'
  }
  else if (!validator.validate(email)) {
    message = 'Email không hợp lệ!'
  }
  else if (!phone) {
    message = 'Chưa nhập số điện thoại!'
  }
  else if (phone.length < 10) {
    message = 'Số điện thoại không hợp lệ!'
  }

  if (message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/forgetPassword')
  }

  //Kiểm tra tài khoản email và số điện thoại có tồn tại trong database
  Account.find({ phoneNumber: phone, email: email }, function (err, accounts) {
    if (err) throw err

    if (accounts.length == 0) {
      req.session.message = {
        type: 'danger',
        msg: 'Số điện thoại và email không tồn tại!'
      }
      return res.redirect(303, '/forgetPassword')
    }

    
    //Tạo mã OTP
    randomOTP.OTP((otp) => {
      /* Tiến hành gửi mã otp */
      Account.updateOne({ email: email }, { $set: { otp: otp, otpTime: new Date() } }, (err, accounts) => {
        if (err) throw err
      })
      sendMail.sendOTP(email,otp)
      res.redirect(303, '/otpForgetPassword');
    });
  })
});

/* GET input opt forget password page*/
router.get('/otpForgetPassword', check.login, function (req, res) {
  content = {
    title: 'OTP quên mật khẩu',
  }
  res.render('otpForgetPassword', content);
});

/* POST input opt forget password page*/
router.post('/otpForgetPassword', function (req, res) {
  var form = new multiparty.Form()
  form.parse(req, function (err, otp) {
    if (err) throw err
    var { OTP } = otp
    Account.findOne({ otp: OTP }, (err, account) => {
      if (err) throw err
      var dt = account.otpTime
      dt.setMinutes(dt.getMinutes()+1)
      if (dt <= new Date() ) {
          req.session.message = {
            type: 'danger',
            msg: 'Mã OTP đã hết hiệu lực sau 1 phút. Xin quý khách vui lòng tạo mã mới!'
          }
          return res.redirect(303, '/forgetPassword')
        }
      else{
        req.session.otp = OTP
        res.redirect(303, '/changeForget')
      }
    })
  })
});


/* GET change forget password page*/
router.get('/changeForget', check.login, function (req, res) {
  content = {
    title: 'Thay đổi mật khẩu',
  }
  res.render('changeForget', content);
});

/* POST change forget password page*/
router.post('/changeForget', check.login, function (req, res) {
  var {newPass, reNewPass} = req.body
  var message
  var otp = req.session.otp
  console.log(newPass)

  if(!newPass)
    message = 'Chưa nhập mật khẩu mới!'
  else if (!reNewPass)
    message = 'Chưa nhập xác nhận!'
  else if (newPass.length < 6)
    message = 'Mật khẩu phải dài hơn 6 ký tự!'
  else if (reNewPass != newPass)
    message = 'Mật khẩu nhập lại không đúng!'
    
  if (message != null){
    req.session.message = {
      type: 'danger',
      msg: message
    }
    console.log(message)
    return res.redirect('changeForget')
  }

  var hashpasssword = bcrypt.hashSync(newPass, 10);
  Account.updateOne({ otp: otp }, { $set: { password: hashpasssword } }, (err) => {
    if (err) throw err
    res.redirect(303, '/login')
  })
});


module.exports = router;
