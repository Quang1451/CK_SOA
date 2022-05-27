$(document).ready(() => {
    /* Kiểm tra ngăn chặn tài khoản chưa xác minh sử dụng các chức năng */
    $('.verify').on('click', (e) => {
        e.preventDefault();
        $('#flipFlop').modal('show');
    })

    /* Các chức năng cho trang rút tiền */
    /* Kiểm tra số tiền nhập khi rút tiền có thấp hơn 50000 hay có phải là bối số của 50000 hay không */
    $('.minMoney').on('change', (e) => {
        var minMoney = e.target
        if (parseInt(minMoney.value) < 50000)
            minMoney.value = 50000
        else {
            var time = parseInt(parseInt(minMoney.value) / 50000)
            minMoney.value = 50000 * time
        }
    })

    /* Các chức năng cho trang nạp thẻ */
    /* Kiểm tra số thẻ lớn hơn 5 hay nhở hơn 1 hay không */
    $('#count').on('change', (e) => {
        var count = e.target
        if (parseInt(count.value) > 5)
            count.value = 5
        else if (parseInt(count.value) < 1)
            count.value = 1
    })

    /* Tính tổng số tiền khi mua thẻ */
    $('#count, #price').on('change', (e) => {
        $('#money').val($('#count').val() * $('#price').val() - $('#fee').val())
    })

    /* Các chức năng cho trang chuyển tiền */
    $('.minMoneyTransfer').on('change', (e) => {
        var minMoney = e.target
        if (parseInt(minMoney.value) < 50000)
            minMoney.value = 50000
    })


    /* Các chức năng cho trang lịch sử giao dịch */
    getAllBills()

    $('tbody').on('click', 'tr',(e) => {
        var row = $(e.target).closest('tr')
        var id = $(row).data('id')

        fetch('/api/bill/'+id)
        .then(res => res.json())
        .then( json => {
            if(json.code == 0) {
                var bill = json.bill
                var content
                switch (bill.type) {
                    case 'Chuyển tiền':
                        var receiver = json.receiver
                        content = `
                        <p><strong>Loại giao dịch: </strong>${bill.type}</p>
                        <p><strong>Mã giao dịch: </strong>${bill._id}</p>
                        <p><strong>Người nhận: </strong>${receiver.name}</p>
                        <p><strong>Tài khoản người nhận: </strong>${receiver.username}</p>
                        <p><strong>Số điện thoại người nhận: </strong>${receiver.phoneNumber}</p>
                        <p><strong>Số tiền gửi: </strong>${formatMoney(bill.money)}</p>
                        <p><strong>Người chịu phí giao dịch: </strong>${checkWhoPayFee(JSON.parse(bill.content).whoPayFee)}</p>
                        <p><strong>Nội dung: </strong>${JSON.parse(bill.content).note}</p>
                        <p><strong>Trạng thái: </strong>${bill.verify}</p>
                        <p><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>`
                        break;
                    case 'Rút tiền':
                        content = `
                        <p><strong>Loại giao dịch: </strong>${bill.type}</p>
                        <p><strong>Mã giao dịch: </strong>${bill._id}</p>
                        <p><strong>Số tiền: </strong>${formatMoney(bill.money)}</p>
                        <p><strong>Nội dung: </strong>${bill.content}</p>
                        <p><strong>Trạng thái: </strong>${bill.verify}</p>
                        <p><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>`
                        break;
                    case 'Nạp tiền':
                        content = `
                        <p><strong>Loại giao dịch: </strong>${bill.type}</p>
                        <p><strong>Mã giao dịch: </strong>${bill._id}</p>
                        <p><strong>Số tiền: </strong>${formatMoney(bill.money)}</p>
                        <p><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>`
                        break;
                    case 'Mua thẻ':
                        content = `
                        <p><strong>Loại giao dịch: </strong>${bill.type}</p>
                        <p><strong>Mã giao dịch: </strong>${bill._id}</p>
                        <p><strong>Loại thẻ: </strong>${JSON.parse(bill.content).type}</p>
                        <p><strong>Mệnh giá: </strong>${formatMoney(JSON.parse(bill.content).price)}</p>
                        <p><strong>Số lượng: </strong>${JSON.parse(bill.content).count}</p>
                        <p><strong>Mã seri: </strong>${JSON.parse(bill.content).seri}</p>
                        <p><strong>Số tiền: </strong>${formatMoney(bill.money)}</p>
                        <p><strong>Phí giao dịch: </strong>${formatMoney(JSON.parse(bill.content).fee)}</p>
                        <p><strong>Thời gian: </strong>${formatDateAndTime(bill.time)}</p>`
                        break;
                }
                $('#info-body').empty()
                $('#info-body').append(content)

            }
        })

        $('#confirm-Information').modal('show')
    })
})

/* Lấy danh sách hóa đơn */
function getAllBills() {
    fetch('/api/allBill')
        .then(res => res.json())
        .then(json => {
            if (json.code == 0) {
                var bills = json.bills
                var table1 = $('#table-history-1')
                var table2 = $('#table-history-2')
                table1.empty()
                table2.empty()

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

                    $(table1).append(`<tr data-id="${bill._id}" scope="row">
                        <td>${stt}</td>
                        <td>${formatDateAndTime(bill.time)}</td>
                        <td>${content}</td>
                        <td><i class="fa fa-money"></i>${formatMoney(bill.money)}</td>
                        <td>${bill.type}</td>
                    </tr>`)

                    $(table2).append(`<tr data-id="${bill._id}" scope="row">
                        <td>${stt}</td>
                        <td>${formatDateAndTime(bill.time)}</td>
                        <td>${content}</td>
                        <td><i class="fa fa-money"></i>${formatMoney(bill.money)}</td>
                        <td>${bill.type}</td>
                        <td style="color: ${color}; font-weight: bold;">${bill.verify}</td>
                    </tr>`)

                    stt += 1
                })
            }
        })
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

/* Format số tiền */
function formatMoney(money) {
    money = parseInt(money)
    money = money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    money = money.replaceAll('.',',')
    return money.replace('VND','đ')
}

/* Check người chịu phí giao dich */
function checkWhoPayFee(whoPayFee) {
    if(whoPayFee == 1)
        return 'Người nhận'
    return 'Người gửi'
}