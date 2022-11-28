let urlAccount = '/api/allAccount'
let usernameAccount
let bill_id
$(document).ready(() => {

    /* Sự kiện cho trang quản lý tài khoản */
    /* Tải danh sách taì khoản khi mới mở trang */
    loadAccount(urlAccount)

    /* Lấy danh sách tài khoan tùy theo trạng thái */
    $('#status').on('change', () => {
        switch ($('#status').val()) {
            case 'tk_ChoKichHoat':
                urlAccount = '/api/waitAccount'
                break
            case 'tk_DaKichHoat':
                urlAccount = '/api/activatedAccount'
                break
            case 'tk_DaVoHieuHoa':
                urlAccount = '/api/canceledAccount'
                break
            case 'tk_DangBiKhoa':
                urlAccount = '/api/lockedAccount'
                break
            default:
                urlAccount = '/api/allAccount'
                break;
        }
        loadAccount(urlAccount)
    })

    /* Hiện dialog xem thông tin tài khoản đã kích hoạt */
    $('tbody').on('click', '.activated', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('/api/accountInfo/'+id)
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
                                `)
                $('#confirm-Information-activated').modal('show')
            }
        })
    })

    /* Hiện dialog xem thông tin tài khoản đã khóa */
    $('tbody').on('click', '.locked', (e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        fetch('/api/accountInfo/'+id)
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
        fetch('/api/accountInfo/'+id)
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
        fetch('/api/accountInfo/'+id)
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
        handleAccount('/api/handleActivated/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#handle-activated-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu bổ sung thông tin */
    $('#confirm-update').on('click', ()=> {
        handleAccount('/api/handleUpdate/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#handle-update-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu vô hiệu hóa tài khoản */
    $('#confirm-canceled').on('click', ()=> {
        handleAccount('/api/handleCanceled/'+usernameAccount)
        $('#confirm-Information-wait').modal('hide')
        $('#confirm-Information-activated').modal('hide')
        $('#handle-canceled-dialog').modal('hide')
    })

    /* Sự kiện gửi yêu cầu mở khóa tài khoản */
    $('#confirm-unlock').on('click', ()=> {
        handleAccount('/api/handleUnlock/'+usernameAccount)
        $('#confirm-Information-block').modal('hide')
        $('#handle-unlock-dialog').modal('hide')
    })


    /* Sự kiện cho trang quản lý các giao dịch */
    getListBill()
    /* Load danh sách giao dịch đang chờ duyệt */
    /*$('tbody').on('click', 'tr',(e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')
        bill_id = id
        fetch('/api/bill/'+id)
        .then(res => res.json())
        .then(json => {
            if(json.code == 0) {
                var bill = json.bill
                var content
                fetch('/api/accountName/'+bill.userSend)
                .then(res => res.json())
                .then(json1 => {
                    if (json1.code == 0) {
                        var accountName = json1.accountName
                    }
                    switch (bill.type) {
                        case 'Chuyển tiền':
                            var receiver = json.receiver
                            content = `
                        <div class="form-group row mb-0">
                            <p class="col-md-6"><strong>Tài khoản gửi: </strong>${bill.userSend}</p>
                            <p class="col-md-6"><strong>Người gửi: </strong>${accountName}</p>
                        </div>
        
                        <div class="form-group row mb-0">
                            <p class="col-md-6"><strong>Tài khoản nhận: </strong>${receiver.username}</p>
                            <p class="col-md-6"><strong>Người nhận: </strong>${receiver.name}</p>
                        </div>
                        
                        <div class="form-group row mb-0">
                            <p class="col-md-6"><strong>Số tiền: </strong>${formatMoney(bill.money)}</p>
                            <p class="col-md-6"><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>
                        </div>
        
                        <div class="form-group row mb-0">
                            <p class="col-md-6"><strong>Trạng thái: </strong><span class="text-primary">${bill.verify}</span></p>
                        </div>
                                        
                        <div class="form-group mb-0">
                            <p><strong>Nội dung:
                                </strong>${JSON.parse(bill.content).note}</p>
                        </div>`
                            $('#confirm-transfer-modal').empty()
                            $('#confirm-transfer-modal').append(content)
                            $('#confirm-transfer').modal('show')
                            break;
                        case 'Rút tiền':
                            content = `
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã tài khoản: </strong>${bill.userSend}</p>
                                    <p class="col-md-6"><strong>Họ và tên: </strong>${accountName}</p>
                                </div>
                
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Mã giao dịch: </strong>${bill._id}</p>
                                    <p class="col-md-6"><strong>Số tiền: </strong>${formatMoney(bill.money)}</p>
                                </div>
                
                                <div class="form-group row mb-0">
                                    <p class="col-md-6"><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>
                                    <p class="col-md-6"><strong>Trạng thái: </strong>${bill.verify}</p>
                                </div>
                                <div class="form-group mb-0">
                                    <p><strong>Ghi chú:
                                    </strong>${bill.content}</p>
                                </div>`
                            $('#confirm-withdraw-modal').empty()
                            $('#confirm-withdraw-modal').append(content)
                            $('#confirm-withdraw').modal('show')
                            break;
                    }
                
                })
            }
        })
    })*/

    /* Hiện dialog xác nhận duyệt giao dịch */
    $('#bill-approve').on('click', ()=> {
        $('#confirm-dialog').modal('show')
    })
    /* Duyệt giao dịch */
    $('#confirm-dialog-confirmed').on('click', ()=> {
        fetch('/api/appr/'+bill_id ,{method: 'POST'})
        .then(res => res.json())
        .then(json => {
        })
        $('#confirm-dialog').modal('hide')
        $('#confirm-withdraw').modal('hide')
        $('#confirm-transfer').modal('hide')
        getListBill()
    })

    /* Hiện dialog xác nhận từ chối giao dịch */
    $('#bill-reject').on('click', ()=> {
        $('#reject-dialog').modal('show')
    })
    /* Từ chối giao dịch */
    $('#reject-dialog-confirmed').on('click', ()=> {
        fetch('/api/rej/'+bill_id ,{method: 'POST'})
        .then(res => res.json())
        .then(json => {

        })
        $('#reject-dialog').modal('hide')
        $('#confirm-withdraw').modal('hide')
        $('#confirm-transfer').modal('hide')
        getListBill()
    })
})
    /*function getListBill() {
        fetch('/api/listBill')
            .then(res => res.json())
            .then(json => {
                if (json.code == 0) {
                    var bills = json.bills
                    var table = $('#table-bill')
                    table.empty()
                    var stt = 1
                    bills.forEach(bill => {
                        var content
                        var color
                        switch (bill.type) {
                            case 'Mua thẻ':
                                content = 'Mua thẻ ' + JSON.parse(bill.content).type
                                break;
                            case 'Nạp tiền':
                                content = ''
                                break;
                            case 'Rút tiền':
                                content = bill.content
                                break;
                            case 'Chuyển tiền':
                                content = JSON.parse(bill.content).note
                                break;
                        }

                        switch (bill.verify) {
                            case 'Đã duyệt':
                                color = 'green'
                                break;
                            case 'Đang chờ':
                                color = 'yellow'
                                break;
                            case 'Bị hủy':
                                color = 'red'
                                break;
                        }
                        fetch('/api/accountName/'+bill.userSend)
                            .then(res => res.json())
                            .then(json1 => {
                                if (json1.code == 0) {
                                    var accountName = json1.accountName
                                    $(table).append(`<tr data-id="${bill._id}" scope="row">
                                        <td>${stt}</td>
                                        <td>${bill.userSend}</td>
                                        <td>${accountName}</td>
                                        <td><i class="fa fa-money"></i>${formatMoney(bill.money)}</td>                                 
                                        <td>${bill.type}</td>
                                        <td style="color: ${color}; font-weight: bold;"><span class="no">${bill.verify}</span></td>
                                        <td>${formatDateAndTime(bill.time)}</td>
                                    </tr>`)
                                    stt += 1
                                }
                            })
                    })
                }
            })
        }*/

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

/* Xử lý thay đổi trang thái của tài khoản */
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
/* Format số ngày và giờ */
function formatDateAndTime(datetime) {
    var date = new Date(datetime)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + strTime;
}