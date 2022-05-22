$(document).ready(() => {
    $('.verify').on('click', (e) => {
        e.preventDefault();
        $('#flipFlop').modal('show');
    })

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
})

