$(document).ready(() => {

    /* Hiện dialog xem thông tin tài khoản đã kích hoạt */
    $('.activated').on('click', ()=> {
        $('#confirm-Information-activated').modal('show')
    })  

    /* Hiện dialog xem thông tin tài khoản đã khóa */
    $('.locked').on('click', ()=> {
        $('#confirm-Information-block').modal('show')
    })  

    /* Hiện dialog xem thông tin tài khoản chờ xác minh */
    $('.wait').on('click', ()=> {
        $('#confirm-Information-wait').modal('show')
    })  

    /* Hiện dialog xem thông tin tài khoản bị vô hiệu hóa */
    $('.canceled').on('click', ()=> {
        $('#confirm-Information-disable').modal('show')
    })
    
    /* Hiện dialog xem thông tin chuyển tiền */
    $('.transfer').on('click', ()=> {
        $('#confirm-transfer').modal('show')
    }) 

    /* Hiện dialog xem thông tin rút tiền */
    $('.withdraw').on('click', ()=> {
        $('#confirm-withdraw').modal('show')
    }) 
})