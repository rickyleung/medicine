/*
 * 修改密码
 * 
 * @author: Ricky
 */

if (errorMsg != "") {
    $(".tip").text(errorMsg).show();
}

$("form").submit(function(e) {
    var oldPassword = $.trim($("#oldPassword").val()),
        newPassword = $.trim($("#newPassword").val()),
        repeatPassword = $.trim($("#repeatPassword").val()),
        tip = $(".tip");
    if (oldPassword == "") {
        tip.text("请输入原密码").show().fadeOut(1500);
        e.preventDefault();
        return;
    }
    if (newPassword == "") {
        tip.text("请输入新密码").show().fadeOut(1500);
        e.preventDefault();
        return;
    }
    if (newPassword != repeatPassword) {
        tip.text("密码不一致").show().fadeOut(1500);
        e.preventDefault();
    }
});
