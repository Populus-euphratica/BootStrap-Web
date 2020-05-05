var form = $("#register");
var email = $("#email");
var title = $("#title");
var Name = $("#Name");
var company;
var reason;
var nameNote = $("#nameNote");
var password = $("#password");
var passwordNote = $("#passwordNote");
var emailNote = $("#emailNote");
$(document).ready(stateManage());
$(document).ready(registerManage());
$(document).ready(slideVerify());
// 切换登录模式
function stateManage() {
  $("#state").click(function () {
    if ($(this).data("state") == "user") {
      $(this).data("state", "admin");
      $("#title").text("管理员登录");
      updateAdminContent();

      $(this).html("<i class='fa fa-user-circle-o' aria-hidden='true'></i>User Register");
    } else if ($(this).data("state") == "admin") {
      $(this).data("state", "user");
      $("#title").text("用户登录");
      $(this).html("<i class='fa fa-user fa-fw' aria-hidden='true'></i>Admin Register");
      updateUserContent();

    }
  });
}

// 滑动验证码
function slideVerify(){
  $('#slider').slideVerify({
    type : 1,		//类型
    vOffset : 5,	//误差量，根据需求自行调整
    barSize : {
      width : '300px',
      height : '40px',
    },
    ready : function() {
    },
    success : function() {
      $("#sliderParent").html("<div class='form-row'><div class='form-group'><input type='text'class='form-control' id='vail' required='required'>"
        +"<small id='emailVailNote' class='form-text text-muted'></small></div><div class='form-group'><button id='sendVail' class='btn btn-primary'>发送验证码</button></div></div>");
        $("#sendVail").click(function(){
          sendEmailVail($("#email").val());
          $("#loginBtn").removeAttr("disabled");
        })
    },
    error : function() {
    }
    
  });

}

function registerManage() {
  form.submit(function (e) {
    e.preventDefault();
    if(!equalVail($("#vail").val(),$("#emailVailNote"))){
        return false;
    }
    if ($("#state").data("state") == "user") {
      registerUser();
    } else {
      registerAdmin();
    }
  })
}


function check() {
  if ($.trim(Name.val()) == "") {
    Name.focus();
    nameNote.text("请输入名称!");
    return false;
  }
  nameNote.text("");
  var rep = /^[a-zA-Z0-9]+@(\d{3}|[a-zA-Z]{2,4}).[a-zA-Z]{2,3}$/;
  if (!rep.test($.trim(email.val()))) {
    email.focus();
    emailNote.text("邮箱格式不对！");
    return false;
  }
  emailNote.text("");
  if (password.val() != $("#confirmPassword").val()) {
    passwordNote.text("密码不一致！")
    return false;
  }
  if ($.trim(password.val()) == "") {
    password.focus();
    passwordNote.text("密码不能为空！")
    return false;
  }
  passwordNote.text("");

  return true;
}

function updateAdminContent() {
  var content = "<label>Reason</label><textarea class='form-control' maxlength='290'id='reason' rows='3' placeholder='您需要告知我们，您注册该账号的原因。'></textarea>";
  title.html("注册管理员账号");
  $("#reasonGroup").html(content);
  $("#companyGroup").empty();
  
}
function updateUserContent() {
  var content = "<label for='company'>Your Company</label> <input type='text' class='form-control' id='company' placeholder='company'>";
  title.html("注册用户账号");
  $("#companyGroup").html(content);
  $("#reasonGroup").empty();
}

function registerUser() {

  if (!check()) {
    return false;
  }
  company = $("#company");
  var registerData = {
    "name": $.trim(Name.val()),
    "company": $.trim(company.val()),
    "email": $.trim(email.val()),
    "password": $.trim(password.val())
  };
  $.ajax({
    url: "http://localhost:8080/api/user/email",
    type: "get",
    data: {
      "email": $.trim(email.val())
    },
    success: function (emailData) {
      if (emailData.id != null) {
        emailNote.text("该邮箱已被其他人使用");
        email.focus();
        return;
      } else {
        $.ajax({
          url: "http://localhost:8080/api/user/",
          type: "post",
          data: JSON.stringify(registerData),
          contentType: "application/json;charset=utf-8;",
          dataType: "json",
          success: function (data) {
            if (data) {
              alert("注册成功！");
              var content="<h1>尊敬的"+registerData.name+"用户</h1><p>您现在已经成功申请本Web API推荐网站的账户，祝您使用愉快！</p>"
              var sendEmailData={
                "content":content,
                "to":registerData.email
              };
              sendEmail(sendEmailData);
            } else {
              alert("注册失败！");
            }
          },
          error: function () {
            alert("连接服务器出错！");
          }
        })
      }
    },
    error: function () {
      alert("连接服务器出错！");
    }
  })

}

function registerAdmin() {
  if (!check()) {
    return false;
  }
  $.ajax({
    url: "http:localhost:8080/api/admin/email",
    type: "get",
    data: {
      "email": $.trim(email.val())
    },
    success: function (emailData) {
      if (emailData.id != null) {
        emailNote.text("该邮箱已被其他人使用");
        email.focus();
        return;
      } else {
        reason = $("#reason");
        var registerData = {
          "name": $.trim(Name.val()),
          "date": getDate(),
          "email": $.trim(email.val()),
          "password": $.trim(password.val()),
          "reason": $.trim(reason.val())
        };
        $.ajax({
          url: "http://localhost:8080/api/applyForAdmin/",
          type: "post",
          data: JSON.stringify(registerData),
          contentType: "application/json;charset=utf-8;",
          dataType: "json",
          success: function (data) {
            if (data) {
              alert("注册成功！");
              window.location.href = "login.html";
            } else {
              alert("注册失败！");
            }
          },
          error: function () {
            alert("连接服务器出错！");
          }
        })
      }
    },
    error: function () {
      alert("连接服务器出错！");
    }
  })
}

// 发送邮件
function sendEmail(data) {
  $.ajax({
    url: "http://localhost:8080/api/email/",
    type: "post",
    data: data,
    success: function (falg) {
      if (falg) {
        alert("成功发送邮件！");
      } else {
        alert("发送邮件失败！");
      }
    },
    error: function () {
      alert("连接服务器失败！");
    }
  })
}

function getDate() {
  var myDate = new Date;
  var year = myDate.getFullYear(); //获取当前年
  var month = myDate.getMonth() + 1; //获取当前月
  var strDate = myDate.getDate(); //获取当前日
  if (month >= 1 && month <= 9) {
    month = "0" + month;
}
if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
}
return "" + year + "-" + month + "-" + strDate;
}