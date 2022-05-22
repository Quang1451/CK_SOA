let urlAccount = 'http://localhost:3000/api/allAccount'
let usernameAccount
$(document).ready(() => {

    /* Sự kiện cho trang quản lý tài khoản */
    /* Tải danh sách tìa khoản khi mới mở trang */
    loadAccount(urlAccount)

    /* Lấy danh sách tài khoanar tùy theo trạng thái */
    $('#status').on('change', () => {
        switch ($('#status').val()) {
            case 'tk_ChoKichHoat':
                urlAccount = 'http://localhost:3000/api/waitAccount'
                break
            case 'tk_DaKichHoat':
                urlAccount = 'http://localhost:3000/api/activatedAccount'
                break
            case 'tk_DaVoHieuHoa':
                urlAccount = 'http://localhost:3000/api/canceledAccount'
                break
            case 'tk_DangBiKhoa':
                urlAccount = 'http://localhost:3000/api/lockedAccount'
                break
            default:
                urlAccount = 'http://localhost:3000/api/allAccount'
                break;
        }
        loadAccount(urlAccount)
    })

    /* Hiện dialog xem thông tin tài khoản đã kích hoạt */
    $('tbody').on('click', '.activated', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('http://localhost:3000/api/accountInfo/'+id)
        .then(res => res.json())
        .then(json => {
            if(json.code === 0){
                var user = json.user
                usernameAccount = user.username
                var body = $('#body-activated-dialog').empty()
        
                $(body).append(`<div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã tài khoản: </strong>${user.username}</p>
                                    <p class="col-md-6"><strong>Họ và tên: </strong>${user.name}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số điện thoại: </strong>${user.phoneNumber}</p>
                                    <p class="col-md-6"><strong>Email: </strong>${user.email}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Ngày sinh: </strong>${user.email}</p>
                                    <p class="col-md-6"><strong>Ngày tạo: </strong>${formatDate(user.createDate)}</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Địa chỉ: </strong>${user.address}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số tiền hiện tại: </strong>${formatMoney(user.money)}</p>
                                    <p class="col-md-6"><strong>Trạng thái: </strong><span class="text-success">${user.verify}</span></p>
                                </div>
                                <div class="form-group row mb-0">
                                    <div class="col-md-6">
                                        <p><strong>Mặt trước CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.front_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="front-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Mặt sau CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.back_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="back-image">
                                    </div>
                                </div>
                                <p><span class="text-danger">Hiển thị lịch sử giao dịch trong tháng hiện hành, mới nhất trước.</span></p>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Tài khoản: </strong>00000000</p>
                                    <p class="col-md-6"><strong>Tên người nhận: </strong>Nguyễn Văn A</p>
                                </div>
                                
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số tiền: </strong>00000000</p>
                                    <p class="col-md-6"><strong>Thời gian: </strong>Nguyễn Văn A</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Nội dung: </strong>Gui tien viet web cuoi ky</p>
                                </div>`)
                $('#confirm-Information-activated').modal('show')
            }
        })
    })

    /* Hiện dialog xem thông tin tài khoản đã khóa */
    $('tbody').on('click', '.locked', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('http://localhost:3000/api/accountInfo/'+id)
        .then(res => res.json())
        .then(json => {
            if(json.code === 0){
                var user = json.user
                usernameAccount = user.username
                var body = $('#body-block-dialog').empty()

                $(body).append(`<div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã tài khoản: </strong>${user.username}</p>
                                    <p class="col-md-6"><strong>Họ và tên: </strong>${user.name}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số điện thoại: </strong>${user.phoneNumber}</p>
                                    <p class="col-md-6"><strong>Email: </strong>${user.email}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Ngày sinh: </strong>${formatDate(user.birthday)}</p>
                                    <p class="col-md-6"><strong>Ngày tạo: </strong>${formatDate(user.createDate)}</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Địa chỉ: </strong>${user.address}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số tiền hiện tại: </strong>${formatMoney(user.money)}</p>
                                    <p class="col-md-6"><strong>Trạng thái: </strong><span class="text-danger">Đang bị khóa</span></p>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-6">
                                        <p><strong>Mặt trước CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.front_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="front-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Mặt sau CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.back_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="back-image">
                                    </div>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Ngày khóa: </strong>${formatDate(user.lockTime)}</p>
                                    <p class="col-md-6"><strong>Ghi chú: </strong>${user.message}</p>
                                </div>`)
                 $('#confirm-Information-block').modal('show')
            }
        })
    })

    /* Hiện dialog xem thông tin tài khoản chờ xác minh */
    $('tbody').on('click', '.wait', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('http://localhost:3000/api/accountInfo/'+id)
        .then(res => res.json())
        .then(json => {
            if(json.code === 0){
                var user = json.user
                usernameAccount = user.username
                var body = $('#body-wait-dialog').empty()
                var color
                switch(user.verify){
                    case 'Chờ xác minh':
                        color = 'text-primary'
                        break;
                    default:
                        color = 'text-warning'
                        break;
                }
                $(body).append(`<div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã tài khoản: </strong>${user.username}</p>
                                    <p class="col-md-6"><strong>Họ và tên: </strong>${user.name}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số điện thoại: </strong>${user.phoneNumber}</p>
                                    <p class="col-md-6"><strong>Email: </strong>${user.email}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Ngày sinh: </strong>${formatDate(user.birthday)}</p>
                                    <p class="col-md-6"><strong>Ngày tạo: </strong>${formatDate(user.createDate)}</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Địa chỉ: </strong>${user.address}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số tiền hiện tại: </strong>${formatMoney(user.money)}</p>
                                    <p class="col-md-6"><strong>Trạng thái: </strong><span class="${color}">${user.verify}</span></p>
                                </div>
                                <div class="form-group row mb-0">
                                    <div class="col-md-6">
                                        <p><strong>Mặt trước CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.front_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="front-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Mặt sau CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.back_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="back-image">
                                    </div>
                                </div>`)
                $('#confirm-Information-wait').modal('show')
            }
        })
    })

    /* Hiện dialog xem thông tin tài khoản bị vô hiệu hóa */
    $('tbody').on('click', '.canceled', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('http://localhost:3000/api/accountInfo/'+id)
        .then(res => res.json())
        .then(json => {
            if(json.code === 0){
                var user = json.user
                usernameAccount = user.username
                var body = $('#body-disable-dialog').empty()

                $(body).append(`<div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã tài khoản: </strong>${user.username}</p>
                                    <p class="col-md-6"><strong>Họ và tên: </strong>${user.name}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số điện thoại: </strong>${user.phoneNumber}</p>
                                    <p class="col-md-6"><strong>Email: </strong>${user.email}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Ngày sinh: </strong>${formatDate(user.birthday)}</p>
                                    <p class="col-md-6"><strong>Ngày tạo: </strong>${formatDate(user.createDate)}</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Địa chỉ: </strong>${user.address}</p>
                                </div>
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Số tiền hiện tại: </strong>${formatMoney(user.money)}</p>
                                    <p class="col-md-6"><strong>Trạng thái: </strong><span class="text-danger">${user.verify}</span></p>
                                </div>
                                <div class="form-group row mb-0">
                                    <div class="col-md-6">
                                        <p><strong>Mặt trước CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.front_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="front-image">
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Mặt sau CCCD: </strong></p>
                                        <img src="/images/CCCD/${user.back_CCCD}" class="img-fluid rounded"
                                            style="width: 100%; height: 300px;" alt="back-image">
                                    </div>
                                </div>`)
                $('#confirm-Information-disable').modal('show')
            }
        })
    })

    /* Hiện dialog xác nhận xác minh tài khoản */
    $('.btn-activated').on('click', ()=> {
        $('#activated-username').html(usernameAccount)
        $('#handle-activated-dialog').modal('show')
    })

    /* Hiện dialog xác nhận yêu cầu bổ xung thông tin */
    $('.btn-update').on('click', ()=> {
        $('#update-username').html(usernameAccount)
        $('#handle-update-dialog').modal('show')
    })

    /* Hiện dialog xác nhận yêu cầu bổ xung thông tin */
    $('.btn-canceled').on('click', ()=> {
        $('#canceled-username').html(usernameAccount)
        $('#handle-canceled-dialog').modal('show')
    })

    /* Hiện dialog xác nhận mở khóa tài khoản */
    $('.btn-unlock').on('click', ()=> {
        $('#unlock-username').html(usernameAccount)
        $('#handle-unlock-dialog').modal('show')
    })

    /* Sự kiện gửi yêu cầu xác minh tài khoản */
    $('#confirm-activated').on('click', ()=> {
        handleAccount('http://localhost:3000/api/handleActivated/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#handle-activated-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu bổ xung thông tin */
    $('#confirm-update').on('click', ()=> {
        handleAccount('http://localhost:3000/api/handleUpdate/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#handle-update-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu vô hiệu hóa tài khoản */
    $('#confirm-canceled').on('click', ()=> {
        handleAccount('http://localhost:3000/api/handleCanceled/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#confirm-Information-activated').modal('hide')
        $('#handle-canceled-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu mở khóa tài khoản */
    $('#confirm-unlock').on('click', ()=> {
        handleAccount('http://localhost:3000/api/handleUnlock/'+usernameAccount)
        $('#confirm-Information-block').modal('hide')
        $('#handle-unlock-dialog').modal('hide')
    })


    /* Sự kiện cho trang quản lý các giao dịch */

    /* Hiện dialog xem thông tin chuyển tiền */
    $('tbody').on('click', '.transfer', (e) => {
        $('#confirm-transfer').modal('show')
    })

    /* Hiện dialog xem thông tin rút tiền */
    $('tbody').on('click', '.withdraw', (e) => {
        $('#confirm-withdraw').modal('show')
    })
})

/* Lấy tất cả tài khoản theo từng trạng thái */
function loadAccount(url) {
    fetch(url)
        .then(res => res.json())
        .then(json => {
            var table = $('#account-table')
            var stt = 1
            table.empty()
            json.forEach(account => {
                var atr
                switch (account.verify) {
                    case 'Đã xác minh':
                        atr = "activated"
                        break;
                    case 'Đã vô hiệu hóa':
                        atr = "canceled"
                        break;
                    default:
                        atr = "wait"
                        break;
                }
                var status = account.verify
                if(account.lockForever) {
                    status = 'Đang bị khóa'
                    atr = "locked"
                }
                $(table).append(`<tr data-id="${account._id}" class=${atr}>
                    <td>${stt}</td>
                    <td>${account.username}</td>
                    <td>${account.name}</td>
                    <td><span>${status}</span></td>
                    <td>${formatDate(account.createDate)}</td>
                    <td>${formatDate(account.CCCDDate)}</td>
                </tr>`)

                stt += 1
            });
        })
}

function handleAccount(apiUrl) {
    fetch(apiUrl ,{method: 'POST'})
        .then(res => res.json())
        .then(json => {
            if(json.code === 0)
                loadAccount(urlAccount)
        })
}

/* Format thời gian thành day/month/year */
function formatDate(date) {
    var dateObj = new Date(date)
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return day + "/" + month + "/" + year;
}
/* Format số tiền */
function formatMoney(money) {
    money = money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    money = money.replaceAll('.',',')
    return money.replace('VND','đ')
}