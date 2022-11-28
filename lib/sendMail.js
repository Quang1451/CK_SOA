const nodemailer = require('nodemailer')

function formatMoney(money) {
    money = money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    money = money.replaceAll('.',',')
    return money.replace('VND','đ')
}

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
        pass: 'igqcsdwppkwhfxeq',
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
            subject: 'Đặt lại mật khẩu',
            text: `Quý khách đã gửi yêu cầu đặt lại mật khẩu.\nMã OTP của quý khách là: ` + otp
        }

        //Tiến hành gửi mã OTP tới email 
        transporter.sendMail(mailOption, (err, data) => {
            if (err)
                console.log(err.message)
            else
                console.log('Gửi thông tin thành công')
        })
    },

    sendTransferOTP: function (email, otp) {
        /* Tạo nội dung mail */
        let mailOption = {
            from: 'nguyenngocdangquang14274@gmail.com',
            to: email,
            subject: 'OTP xác nhận chuyển tiền',
            text: `Quý khách đã thực hiện một yêu cầu chuyển tiền.\nMã OTP của quý khách là: ` + otp
        }

        //Tiến hành gửi mã OTP tới email 
        transporter.sendMail(mailOption, (err, data) => {
            if (err)
                console.log(err.message)
            else
                console.log('Gửi thông tin thành công')
        })
    },

    sendTransferMoney: function (email, money, fee, whoPayFee, userSend, note) {
        /* Tạo nội dung mail */
        var whoPay = 'Người gửi'
        if (whoPayFee == 1)
            whoPay = 'Người nhận'
        let mailOption = {
            from: 'nguyenngocdangquang14274@gmail.com',
            to: email,
            subject: 'Chuyển tiền',
            text: `Tài khoản gửi: ${userSend}\nSố tiền nhận: ${formatMoney(money)}\nPhí giao dịch: ${formatMoney(fee)}\nNgười thanh toán phí giao dịch: ${whoPay}\nNội dung: ${note}`
        }

        //Tiến hành gửi mã OTP tới email 
        transporter.sendMail(mailOption, (err, data) => {
            if (err)
                console.log(err.message)
            else
                console.log('Gửi thông tin thành công')
        })
    },
}