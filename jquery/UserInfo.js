var stateData = JSON.parse(sessionStorage.getItem("stateData"));
var updatePlace;
var pageNum = 1;
var searchUrl = "";
var menuType = "";
var footerParent = "concernFooter";
$(document).ready(init());
$(document).ready(userInit());
$(document).ready(menuInit());
$(document).ready(addAPI());
$(document).ready(cancelConcern());
$(document).ready(updateUser());
// 个人中心初始化
function userInit() {
  $.ajax({
    url: "http://localhost:8080/api/user/id",
    type: "get",
    data: {
      "id": stateData.id
    },
    success: function (data) {
      $("#userName").html(data.name);
      $("#userCompany").html(data.company);
      $("#userEmail").html(data.email);
    }
  })
}

// 网页初始化以便获取使用者的信息
function init() {

  var login = sessionStorage.getItem("login");
  if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData)) {
    window.location.href = "Login.html";
  }

  $("#state").html("<i class='fa fa-user-circle-o' aria-hidden='true'></i>" + stateData.name);


}
// 操作菜单初始化
function menuInit() {
  $("#menu").click(function (event) {
    menuType = $(event.target).data("menu");
    pageNum = 1;
    if (menuType == "info") {
      userInit();
    } else if (menuType == "concern") {
      searchUrl = "http://localhost:8080/api/userConcern/userId";
      updatePlace = $("#tabtwo");
      footerParent = "concernFooter";
      reFresh()
    } else if (menuType == "upload") {
      searchUrl = "http://localhost:8080/api/userUpload/userId";
      updatePlace = $("#tabthree");
      footerParent = "uploadFooter";
      reFresh();
    }
  })
}

// 实现上传API的功能
function addAPI() {
  $("#addSubmit").click(function () {
    var addName = $("#addName");
    var addCategory = $("#addCategory");
    var addDescription = $("#addDescription");
    var addVersions = $("#addVersions");
    if ($.trim(addName.val()) == "") {
      showResult("请输入值")
      return;
    }
    var addData = {
      "name": $.trim(addName.val()),
      "category": $.trim(addCategory.val()),
      "versions": $.trim(addVersions.val()),
      "description": $.trim(addDescription.val()),
      "userId": stateData.id,
      "email": stateData.email,
      "date": getDate()
    };
    if (addData.description.length == 0) {
      addData.descriptionBrief = "";
    } else if (addData.description.length > 300) {
      addData.descriptionBrief = addData.description.substring(0, 200) + "...";
    } else {
      addData.descriptionBrief = addData.description;
    }
    $.ajax({
      url: "http://localhost:8080/api/userUpload/",
      type: "post",
      data: JSON.stringify(addData),
      contentType: "application/json;charset=utf-8",
      dataType: "text",
      success: function (flag) {
        addName.val("");
        addCategory.val("");
        addDescription.val("");
        addVersions.val("");
        if (flag) {
          showResult("添加成功!!!");
        } else {
          showResult("添加失败");
        }
      },
      error: function () {
        showResult("添加失败error");
      }
    })
  })
}

// 实现页脚在界面的显示
function footerContent(pageNum, hasPreviousPage, hasNextPage, navigatepageNums) {
  var content = "<ul class='pagination justify-content-center' data-id='footer'>";
  if (!hasPreviousPage) {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item active'> <a class='page-link' href='#' data-pagenum=" + val + ">" + val + "</a></li>"
      } else if (i <= 3) {
        content += "<li class='page-item'> <a class='page-link' href='#' data-pagenum=" + val + ">" + val + "</a></li>"
      } else {
        content += "<li class='page-item'> <a class='page-link' href='#'  data-pagenum=" + val + ">" + "Next" + "</a></li>"
      }
    })
  } else if (!hasNextPage) {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item'> <a class='page-link' href='#' data-pagenum=" + val + ">" + "Prev" + "</a></li>"
      } else if (i < Object.keys(navigatepageNums).length - 1) {
        content += "<li class='page-item'> <a class='page-link' href='#' data-pagenum=" + val + ">" + val + "</a></li>"
      } else {
        content += "<li class='page-item active'> <a class='page-link' href='#' data-pagenum=" + val + ">" + val + "</a></li>"
      }
    })
  } else {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item'> <a class='page-link'  href='#' data-pagenum=" + val + ">" + "Prev" + "</a></li>"
      } else if (i < 4) {
        if (val != pageNum) {
          content += "<li class='page-item' > <a class='page-link'  href='#' data-pagenum=" + val + ">" + val + "</a></li>"
        } else {
          content += "<li class='page-item active'> <a class='page-link' href='#' data-pagenum=" + val + ">" + val + "</a>								</li>"
        }
      } else {
        content += "<li class='page-item'> <a class='page-link'  href='#' data-pagenum=" + val + ">" + "Next" + "</a></li>"
      }
    })
  }
  content += "</ul>";
  $("'#" + footerParent + "'").html(content);
}
// 实现根据页脚进行跳转的功能
function footerEnterAPI() {
  $("ul[data-footer]").click(function (event) {
    pageNum = $(event.target).data("pagenum");
    reFresh();
  })
}
// 刷新界面
function reFresh() {
  $.ajax({
    url: searchUrl,
    type: "get",
    data: {
      "userId": stateData.id,
      "pageNum": pageNum
    },
    success: function (data) {
      if (data.total > 0) {
        // tableContent(data.list);
        if (menuType == "concern") {
          concernCardContent(data.list);
        } else if (menuType == "upload") {
          uploadCardContent(data.list);
        }
        if (data.pages > 1) {
          footerContent(data.pageNum, data.hasPreviousPage, data.hasNextPage, data.navigatepageNums);
          footerEnterAPI();
        }
      } else {
        updatePlace.html("<h1>这里什么都没有，去别的地方看看吧</h1>");
      }
    },
    error: function () {
      updatePlace.empty();
      showResult("刷新界面失败!!!");
    }
  })
}

// 更新上传历史面板内容
function uploadCardContent(list) {
  var content = "";
  $.each(list, function (i, val) {
    content += "<div class='col-md-12 pb-3'><div class='card'><div class='card-body'><div class='d-flex w-100 justify-content-between'><h5 class='card-title'><strong>" + val.name + "</strong></h5>"
      + "<small>" + val.date + "</small></div><div class='d-flex w-100 justify-content-between'><p>种类：" + val.category + "</p><p>版本：" + val.versions + "</p></div>"
      + "<p class='card-text'>简介：" + val.descriptionBrief + "</p><div name='chooseApply' class='d-flex w-100 justify-content-between' data-id='" + val.id + "'data-name='" + val.name + "'data-email='" + val.email + "'data-password='"
      + val.password + "'><p >目前是否被管理员审核：" + val.istrue + "</p><p  class='card-link mr-3'>是否审核通过：" + val.decide + "</p></div></div></div></div>";

  })
  content += "<div id='" + footerParent + "'></div>";
  updatePlace.html(content);
}

// 更新收藏面板内容
function concernCardContent(list) {
  var content = "";
  $.each(list, function (i, val) {
    content += "<div class='col-md-12 pb-3'><div class='card' ><div class='card-body'><div class='d-flex w-100 justify-content-between'><h5 class='card-title'><strong>" + val.name + "</strong></h5>"
      + "<small>" + val.date + "</small></div><div class='d-flex w-100 justify-content-between'><p>种类：" + val.category + "</p><p>版本：" + val.versions + "</p></div>"
      + "<p class='card-text'>简介：" + val.descriptionBrief + "</p><div  class='row justify-content-end'><button class='btn btn-primary btn-icon rounded mr-5' type='button' data-btn='concern' data-id=" + val.id + "><i class='fa fa-heart fa-lg' aria-hidden='true'></i></button></div></div></div></div>";

  })
  content += "<div id='" + footerParent + "'></div>";
  updatePlace.html(content);
}
// 用户收藏或取消
function cancelConcern() {
  $(document).on("click", "button[data-btn='concern']", function () {
    var btn = $(this);
    $.ajax({
      url: "http://localhost:8080/api/userConcern/id",
      type: "delete",
      data: {
        "id": btn.data("id")
      },
      success: function (flag) {
        if (flag) {
          btn.html("<i class='fa fa-heart-o fa-lg' aria-hidden='true'></i>");
          btn.parents(".card").slideUp(1000)
          // btn.parents(".card").fadeOut(1000)
        }
      }
    })
  })
}

// 根据列表填充表格内容
function tableContent(list) {
  var content = "<div class='table-responsive'><table class='table table-bordered '><thead class='thead-dark'><tr><th>#</th><th>First</th><th>Last</th></tr>"
    + "</thead><tbody>";
  $.each(list, function (i, val) {
    content += "<tr data-id=" + list[i].id + "><th><input type='checkbox'></th><td data-toggle='modal' data-target='#exampleModal'>" + list[i].name +
      "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].descriptionBrief + "</td><td data-toggle='modal' data-target='#exampleModal'>"
      + list[i].category + "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].versions + "</td></tr>";
  })
  content += "</tbody></table></div>"
  updatePlace.html(content);
  // $("#footerParent").empty();

}


function updateUser() {
  var updateClick=$("#okUpdate");
  $("#updateUserInfo").click(function () {
    $('#modal').modal('show');
    var content = "<div class='form-group'> <label for='updateName'>Your Name</label> <input type='text' class='form-control' id='updateName' placeholder='name' required='required'>"
      + "<small id='nameNote' class='form-text text-muted'></small></div><div class='form-group'> <label for='updateCompany'>Your Company</label> <input type='text' class='form-control'"
      + "id='updateCompany' placeholder='company'> </div>";
    $("#userConent").html(content);
    var name = $("#updateName");
    var company = $("#updateCompany");
    name.val(stateData.name);
    company.val(stateData.company);
    updateClick.off();
    updateClick.click(function () {


      if (!checkUserInfo(name)) {
        return false;
      }
      $.ajax({
        url: "http://localhost:8080/api/user/name/id",
        type: "put",
        data: {
          "name": name.val(),
          "company": company.val(),
          "id": stateData.id
        },
        success: function (flag) {
          if (flag) {
            alert("更新用户信息成功!");
            stateData.name = name.val();
            stateData.company = company.val();
            sessionStorage.setItem("stateData", JSON.stringify(stateData));
            userInit();
          } else {
            alert("更新用户信息失败!");
          }
        },
        error: function () {
          alert("连接服务器失败!");
        }
      })
    })
  });
  $("#updatePassword").click(function () {
    $('#modal').modal('show');
    var content = "<div class='form-group'> <label for='password'>Your Password</label> <input type='Password' class='form-control' id='password' placeholder='输入密码' required='required'>"
      + "</div><div class='form-group'> <label for='updateConfirmPassword'>Confirm Password</label> <input type='Password' class='form-control'"
      + "id='updateConfirmPassword' placeholder='重复输入密码' required='required'> <small id='passwordNote' class='form-text text-muted'></small></div>";
    $("#userConent").html(content);
    updateClick.off();
    updateClick.click(function () {
      var password = $("#password");
      var confirmPassword = $("#updateConfirmPassword");
      if (!checkUserPassword(password, confirmPassword)) {
        return false;
      }
      $.ajax({
        url: "http://localhost:8080/api/user/password/id",
        type: "put",
        data: {
          "password": password.val(),
          "id": stateData.id
        },
        success: function (flag) {
          if (flag) {
            alert("更新用户密码成功!");
            stateData.password = password.val();
            sessionStorage.setItem("stateData", JSON.stringify(stateData));
            var emailContent="<h1>请注意！</h1><p>您的密码刚刚发生更改！</p>"
            var emailDate={
              "content":emailContent,
              "to":stateData.email
            };
            sendEmail(emailDate);
          } else {
            alert("更新用户密码失败!");
          }
        },
        error: function () {
          alert("连接服务器失败!");
        }
      })
    })
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
 

function checkUserInfo(name) {
  var nameNote = $("#nameNote");
  if ($.trim(name.val()) == "") {
    name.focus();
    nameNote.text("请输入名称!");
    return false;
  }
  nameNote.text("");
  return true;
}

function checkUserPassword(password, confirmPassword) {
  var passwordNote = $("#passwordNote");
  if (password.val() != confirmPassword.val()) {
    password.focus();
    passwordNote.text("密码不一致！");
    return false;
  }
  if ($.trim(password.val()) == "") {
    password.focus();
    passwordNote.text("密码不能为空！");
    return false;
  }
  passwordNote.text("");
  return true;
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


function showResult(result) {
  // $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
  alert(result);
}
