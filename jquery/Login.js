var email = $("#email");
var password = $("#password");
// 检查格式
function check() {
  var rep = /^[a-zA-Z0-9]+@(\d{3}|[a-zA-Z]{2,4}).[a-zA-Z]{2,3}$/;
  if (!rep.test(email.val())) {
    email.focus();
    $("#emailNote").text("邮箱格式不对！");
    return false;
  }
  $("#emailNote").text("");
  if (password.val() != "" || password.val() != null || $.trim(password.val()).length == 0) {
    password.focus();
    $("#passwordNote").text("密码不能为空！")
    return false;
  }
  $("#passwordNote").text("");

  return true;
}
// 切换登录模式
$("#state").click(function () {
  if ($(this).data("state") == "user") {
    $(this).data("state", "admin");
    $("#title").text("管理员登录");
    $(this).html("<i class='fa fa-user-circle-o' aria-hidden='true'></i>User Sign");
  } else if ($(this).data("state") == "admin") {
    $(this).data("state", "user");
    $("#title").text("用户登录");
    $(this).html("<i class='fa fa-user fa-fw' aria-hidden='true'></i>Admin Sign");
  }
});

$(document).ready(remember());
// 登录
function loginWeb() {
  var state = $("#state").data("state");
  var loginData = {
    "email": email.val(),
    "password": password.val()
  };
  $.ajax({
    url: "http://localhost:8080/api/" + state + "/login",
    dataType: "json",
    type: "post",
    contentType: "application/json;charset=utf-8;",
    data: JSON.stringify(loginData),
    success: function (data) {
      if (data) {
        $.ajax({
          url: "http://localhost:8080/api/" + state + "/email",
          type: "get",
          data: {
            "email": email.val()
          },
          success: function(data){
            sessionStorage.setItem("login", "true");
            sessionStorage.setItem("state",state);
            sessionStorage.setItem("stateData",JSON.stringify(data));
            if (state == "user") {
              window.location.href = "Home.html";
            } else if (state == "admin") {
              window.location.href = "UserManage.html";
            }
          }
        })

      } else {
        $("#error").html("账号或密码错误");
      }
    },
    error: function () {
      alert("访问服务器失败");
    }
  })
}
// 记住密码
function remember() {
  if ($.cookie("email") && $.cookie("password")) {
    email.val($.cookie("email"));
    password.val($.cookie("password"));
    $("#remember").attr("checked", 'checked');
  }
  $("#loginFrom").submit(function (e) {
    e.preventDefault();
    if ($("#remember").is(":checked")) {
      $.cookie("email", email.val(), { path: "/", expires: 7 });
      $.cookie("password", password.val(), { path: "/", expires: 7 });
    } else {
      $.cookie("email", null);
      $.cookie("password", null);
    }
    loginWeb();
  });
};