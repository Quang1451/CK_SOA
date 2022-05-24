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
        if(parseInt(minMoney.value) < 50000)
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
        if(parseInt(count.value) > 5)
            count.value = 5
        else if(parseInt(count.value) < 1)
            count.value = 1
    })

    /* Tính tổng số tiền khi mua thẻ */
    $('#count, #price').on('change', (e) => {
        $('#money').val($('#count').val() * $('#price').val() - $('#fee').val())
    })

    /* Các chức năng cho trang chuyển tiền */
    $('.minMoneyTransfer').on('change', (e) => {
        var minMoney = e.target
        if(parseInt(minMoney.value) < 50000)
            minMoney.value = 50000
    })
})

