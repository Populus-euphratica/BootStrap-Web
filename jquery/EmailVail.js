var str = "0123456789abcdefghijkABCDEFGHIJK";

function randInt(max) {
    return Math.floor(Math.random() * 1000 % max);
}

function randCode(len) {
    var code = "";
    for (i = 0; i < len; i++) {
        code += str.charAt(randInt(str.length));
    }
    return code;
}

function sendEmailVail(to) {
    var vailCode = randCode(6);
    var content = "<p>您的验证码为：</p><h1>" + vailCode + "</h1><p>请妥善保管，不要泄露给他人！</p>"
    sessionStorage.setItem("emailVailTime", getTime());
    sessionStorage.setItem("vailCode", vailCode);
    var emailData={
        "content":content,
        "to":to
    }
    sendEmail(emailData);
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
 

function getTime() {
    var time = (new Date()).valueOf();
    return time;
}

function equalVail(inputCode,note){
    note.text("");
    var nowTime=getTime();
    var vailCode=sessionStorage.getItem("vailCode");
    var vailCodeTime=sessionStorage.getItem("emailVailTime");
    if((nowTime-vailCodeTime)<600000){
        if(inputCode==vailCode){
          return true;
        }else{
            note.text("验证码错误！");
        }
      }else{
          note.text("验证码已超时失效，请重新获取验证码");
      }
      return false;

}