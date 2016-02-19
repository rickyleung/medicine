<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>登录</title>
<link rel="stylesheet" type="text/css" href="asset/css/login.css"/>
</head>

<body>
<div class="login-form">
    <span class="tip" style="display:none"></span>
    <form method="post" action="tologin.do">
        <div><label>用户名：</label><input type="text" class="elm" id="username" name="username" maxlength="32" /></div>
        <div><label>密码：</label><input type="password" class="elm" id="password" name="password" maxlength="32" /></div>
        <div><input type="submit" class="btn" value="登录" /></div>
    </form>
    <span class="icon"></span>
</div>
<p>痰热清上市后再评价的真实世界研究信息系统</p>

<script>var errorMsg = "${errorMsg}";</script>
<script src="src/lib/jquery.js"></script>
<script src="src/login.js"></script>
</body>
</html>