const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    /* host: 'mail.phongdaotao.com',
    port: 25,
    secure: false,
    auth: {
      user: 'sinhvien@phongdaotao.com',
      pass: 'svtdtu',
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }, */
    service: 'gmail',
    auth: {
        user: 'nguyenngocdangquang14274@gmail.com',
        pass: 'quang14052001',
    },
});

module.exports = {
    sendAccount: function (email, username, password) {
        /* Tạo nội dung mail */
        let mailOption = {
            from: 'nguyenngocdangquang14274@gmail.com', /* 'sinhvien@phongdaotao.com' */
            to: email[0],
            subject: 'Tạo tài khoản ví điện tử',
            text: `Username: ${username}\nPassword: ${password}`
        }

        /* Tiến hành gửi username và password tới email */
        transporter.sendMail(mailOption, (err, data) => {
            if (err)
                console.log(err.message)
            else
                console.log('Gửi thông tin thành công')
        })
    },

    sendOTP: function (email, otp) {
         /* Tạo nội dung mail */
        let mailOption = {
            from: 'nguyenngocdangquang14274@gmail.com',
            to: email,
            subject: 'Lấy lại mật khẩu',
            text: `Mã OTP của quý khách là: ` + otp
        }

        //Tiến hành gửi mã OTP tới email 
        transporter.sendMail(mailOption, (err, data) => {
            if (err)
                console.log(err.message)
            else
                console.log('Gửi thông tin thành công')
        })
    }
}