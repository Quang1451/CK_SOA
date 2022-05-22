var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var bcrypt = require("bcrypt");
var exphbs = require('express-handlebars')
var Account = require('./models/account')
var Card = require('./models/card')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main.hbs',
  helpers: {
    /* Format thời gian thành day/month/year */
    formatDate: function (dateObj) {
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      return day + "/" + month + "/" + year;
    },

    /* Format số tiền */
    formatMoney: function (money) {
      money = money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
      money = money.replaceAll('.', ',')
      return money.replace('VND', 'đ')
    },

    /* Kiểm tra xen nếu tài khoản chưa xác minh thì khóa một vài tính năng */
    verifyAccount: function (verify) {
      if (verify == 'Đã xác minh')
        return
      return 'verify'
    }
  }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret' }))

Account.find((err, accounts) => {
  if (accounts.length) return

  const hashpasssword = bcrypt.hashSync('123456', 10);
  new Account({
    phonneNumber: '0000000000',
    email: 'admin@gmail.com',
    birthday: new Date(),
    name: 'Admin',
    username: 'admin',
    password: hashpasssword,
    role: 'admin',
    changePassword: false,
    verify: 'Đã xác minh'
  }).save();
})

Card.find((err, cards) => {
  if (cards.length) return
  
  new Card({
    id: '111111',
    time: new Date('2022-10-10T00:00:00.000+00:00'),
    CVV:  '411',
    note: 'Không giới hạn số lần nạp và số tiền mỗi lần nạp'
  }).save()

  new Card({
    id: '222222',
    time: new Date('2022-11-11T00:00:00.000+00:00'),
    CVV:  '443',
    note: 'Không giới hạn số lần nạp nhưng chỉ được nạp tối đa 1 triệu/lần'
  }).save()

  new Card({
    id: '333333',
    time: new Date('2022-12-12T00:00:00.000+00:00'),
    CVV:  '577',
    note: 'Khi nạp bằng thẻ này thì luôn nhận được thông báo là “thẻ hết tiền”'
  }).save()
})

app.use(function (req, res, next) {
  res.locals.account = req.session.account
  res.locals.message = req.session.message
  delete req.session.message
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
