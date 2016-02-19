/*
 * 主程序
 * 
 * @author : Ricky
 */

$(document).ready(function() {
    //加载模版
    $.Mustache.load("asset/tpl/main.html").done(function() {
        util.fixOld();
        
        //session信息
        es.roleName = $("#RoleName").val();
        es.roleId = $("#RoleId").val();
        es.userName = $("#UserName").val();
        es.userId = $("#UserId").val();
        es.hospitalName = $("#HospitalName").val();
        
        es.init();
    });
});
