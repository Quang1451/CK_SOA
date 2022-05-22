$('.number-only').keyup(function (event) {
    if (event.which !== 8 && event.which !== 0 && event.which < 48 || event.which > 57) {
        // 0 for null value
        // 8 for backspace
        // 48-57 for 0-9 numbers
        this.value = this.value.replace(/\D/g, "");
    }
});
// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

