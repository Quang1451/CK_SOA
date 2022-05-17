var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var validator = require('email-validator');
var bcrypt = require('bcrypt');
var fs = require('fs')
var path = require('path')

const nodemailer = require('nodemailer')
const Account = require('../models/account.js');
const { resourceUsage } = require('process');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'huaphucdung2001@gmail.com',
    pass: '15062001dung',
  }
});


/* GET login page. */
router.get('/login', function (req, res) {

  content = {
    title: 'Login',
    css: 'login.css'
  }
  res.render('login', content);
});

/* POST login page. */
router.post('/login', function(req,res) {
  var {username, password} = req.body
  var message
  if(!username)
    message = 'Chưa nhập username!'
  else if(!password)
    message = 'Chưa nhập password!'
  else if(password.length < 6)
    message = 'Password ít nhất phải có 6 ký tự!'

  if(message) {
    req.session.message = {
      type: 'danger',
      msg: message
    }
    return res.redirect(303, '/login')
  }

  Account.findOne({username : username}, (err, account) => {
    if (err) throw err

    if(!account) {
      req.session.message = {
        type: 'danger',
        msg: 'Tài khoản không tồn tài!'
      }
      return res.redirect(303, '/login')
    }

    if(bcrypt.compareSync(password, account.password)) {
      req.session.account = account
      return res.redirect(303,'/') 
    }

    req.session.message = {
      type: 'danger',
      msg: 'Sai mật khẩu!'
    }
    res.redirect(303, '/login')
  })
})

/* GET register page. */
router.get('/register', function (req, res) {

  content = {
    title: 'Register',
    css: 'login.css'
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
        var dir = path.join(root,'public','images','CCCD')
        var newFrontCCCD = path.join(dir,'front_'+phone[0]+'.jpg')
        var newBackCCCD = path.join(dir,'back_'+phone[0]+'.jpg')

        if(!fs.existsSync(dir))
          fs.mkdirSync(dir)

        /* Lưu hình ảnh mặt trước CCCD */
        fs.rename(frontCCCD[0].path, newFrontCCCD, (err) => {
          if(err)
            console.log(err.message)
          else
            console.log('Lưu hình ảnh mặt trước CCCD thành công!')
        })

        /* Lưu hình ảnh mặt sau CCCD */
        fs.rename(backCCCD[0].path, newBackCCCD, (err) => {
          if(err)
            console.log(err.message)
          else
            console.log('Lưu hình ảnh mặt sau CCCD thành công!')
        })

        /* Ngẫu nhiên username */
        var username = Math.floor(Math.random() * 10000000000).toString()
        while (username.length < 10) {
          username = '0' + username;
        }

        /* Ngẫu nhiên password */
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var password = ''
        for (var i = 0; i < 6; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          password += chars.substring(rnum, rnum + 1);
        }

        let mailOption = {
          from: 'huaphucdung2001@gmail.com',
          to: email[0],
          subject: 'Tạo tài khoản ví điện tử',
          text: `Username: ${username}\nPassword: ${password}`
        }

        var hashpasssword = bcrypt.hashSync(password, 10);

        new Account({
          phoneNumber: phone[0],
          email: email[0],
          name: name[0],
          birthday: birthday[0],
          address: address[0],
          username: username,
          password: hashpasssword,
          front_CCCD: path.basename(newFrontCCCD), 
          back_CCCD: path.basename(newBackCCCD)
        }).save()
        
        /* Tiến hành gửi username và password tới email */
        transporter.sendMail(mailOption, (err, data) => {
          if (err)
            console.log(err.message)
          else
            console.log('Gửi thông tin thành công')
        })
        res.redirect(303,'/login')
      })
    }
  });
})



module.exports = router;
