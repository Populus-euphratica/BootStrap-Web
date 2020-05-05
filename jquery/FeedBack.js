var theme = $("#theme");
var content = $("#content");
var themeNote = $("#themeNote");
var contentNote = $("#contentNote");

var stateData = JSON.parse(sessionStorage.getItem("stateData"));
$(document).ready(init());
$(document).ready(sendFeedBack());

// 登录的用户信息初始化


function init() {
    var state = sessionStorage.getItem("state");
    var login = sessionStorage.getItem("login");
    if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData) || state != "user") {
        window.location.href = "Login.html";
    }

    $("#state").html("<i class='fa fa-user-circle-o d-inline fa-lg' aria-hidden='true'></i>" + stateData.name);


}

function sendFeedBack() {
    $("#feedBackFrom").submit(function (event) {
        event.preventDefault();
        if (!check()) {
            return false;
        }
        var sendData = {
            "theme": $.trim(theme.val()),
            "content": $.trim(content.val()),
            "istrue": false,
            "userId": stateData.id,
            "date": getDate()
        }
        $.ajax({
            url: "http://localhost:8080/api/feedBack/",
            type: "post",
            data: JSON.stringify(sendData),
            contentType: "application/json;charset=utf-8",
            dataType: "text",
            success: function (falg) {
                if (falg) {
                    showResult("发送成功！");
                    theme.val("");
                    content.val("");
                } else {
                    showResult("发送失败");
                }
            }
        })
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

function check() {
    if ($.trim(theme.val()) == "") {
        themeNote.text("主题不能为空！");
        return false;
    }
    themeNote.val("");
    if ($.trim(content.val()) == "") {
        contentNote.text("正文内容不能为空！");
        return false;
    }
    contentNote.val("");
    return true;
}

function showResult(result) {
// $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
    alert(result);
}
