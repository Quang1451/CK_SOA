var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {

  content = {
    title: 'Login',
    css: 'login.css'
  }
  res.render('login', content);
});

router.get('/register', function(req, res, next) {

  content = {
    title: 'Register',
    css: 'login.css'
  }
  res.render('register', content);
});

module.exports = router;
