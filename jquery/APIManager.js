

// 定义全局变量方便下面进行页面刷新和实现页面跳转
var pageNum = 1;
var pageSize = 8;
var searchUrl = "";
var searchType = "";
var searchValue = "";
var data1 = {};

// 登录的管理员信息初始化
var stateData = JSON.parse(sessionStorage.getItem("stateData"));
$(document).ready(init());
function init() {
  var state = sessionStorage.getItem("state");
  var login = sessionStorage.getItem("login");
  if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData)||state!="admin") {
    window.location.href = "Login.html";
  }

  $("#state").html("<i class='fa fa-user fa-fw' aria-hidden='true'></i>" + stateData.name);
  messageNum()
}
// 获取未处理消息总数
function messageNum() {
  $.ajax({
    url: "http://localhost:8080/api/admin/message/sum",
    type: "get",
    success: function (messageNum) {
      if (messageNum > 0) {
        $("#message").html("<i class='fa fa-bell-o' aria-hidden='true'></i>Message");
      }
    }
  })
}

// 实现搜索功能
function search() {

  $("#search").click(function () {
    var searchContent = $.trim($("#searchContent").val());
    pageNum = 1;
    if (searchContent == "") {
      searchUrl = "http://localhost:8080/api/api/";
      searchType = "get";
      data1 = {
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
    } else if (searchValue == "name") {
      searchUrl = "http://localhost:8080/api/api/name";
      searchType = "get";
      data1 = {
        "name": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
    } else if (searchValue == "category") {
      searchUrl = "http://localhost:8080/api/api/category";
      searchType = "get";
      data1 = {
        "category": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
    } else {
      searchUrl = "http://localhost:8080/api/api/all";
      searchType = "get";
      data1 = {
        "val": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
    }
  });
}
$(document).ready(dropdownMenu());
$(document).ready(search());
$(document).ready(addAPI());
$(document).ready(APIManager());
$(document).ready(ToAPIVersions());
// 实现与服务器的沟通，主要为了减少代码量
function ajaxAPI(data1) {
  $.ajax({
    url: searchUrl,
    type: searchType,
    data: data1,
    success: function (data) {
      tableContent(data.list);
      if (data.pages > 1) {
        footerContent(data.pageNum, data.hasPreviousPage, data.hasNextPage, data.navigatepageNums);
        footerEnterAPI(data1);
      }
      showResult("查询成功");
    },
    error: function () {
      $("#api").empty();
      showResult("error!!!");
    }
  })
}
// 实现页脚在界面的显示
function footerContent(pageNum, hasPreviousPage, hasNextPage, navigatepageNums) {
  var content = "<ul class='pagination justify-content-center' id='footer'>";
  if (!hasPreviousPage) {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item active'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a></li>"
      } else if (i <= 3) {
        content += "<li class='page-item'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a></li>"
      } else {
        content += "<li class='page-item'> <a class='page-link'   data-pagenum=" + val + ">" + "Next" + "</a></li>"
      }
    })
  } else if (!hasNextPage) {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item'> <a class='page-link'  data-pagenum=" + val + ">" + "Prev" + "</a></li>"
      } else if (i < Object.keys(navigatepageNums).length - 1) {
        content += "<li class='page-item'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a></li>"
      } else {
        content += "<li class='page-item active'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a></li>"
      }
    })
  } else {
    $.each(navigatepageNums, function (i, val) {
      if (i == 0) {
        content += "<li class='page-item'> <a class='page-link'   data-pagenum=" + val + ">" + "Prev" + "</a></li>"
      } else if (i < 4) {
        if (val != pageNum) {
          content += "<li class='page-item' > <a class='page-link'   data-pagenum=" + val + ">" + val + "</a></li>"
        } else {
          content += "<li class='page-item active'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a>								</li>"
        }
      } else {
        content += "<li class='page-item'> <a class='page-link'   data-pagenum=" + val + ">" + "Next" + "</a></li>"
      }
    })
  }
  content += "</ul>";
  $("#footerParent").html(content)
}
// 实现根据页脚进行跳转的功能
function footerEnterAPI(data1) {
  $("#footer").click(function (event) {
    pageNum = $(event.target).data("pagenum");
    data1.pageNum = pageNum;
    reFresh();
  })
}
// 刷新界面
function reFresh() {
  
  messageNum();
  $.ajax({
    url: searchUrl,
    type: searchType,
    data: data1,
    success: function (data) {
      tableContent(data.list);
      if (data.pages > 1) {
        footerContent(data.pageNum, data.hasPreviousPage, data.hasNextPage, data.navigatepageNums);
        footerEnterAPI(data1);
      }
    },
    error: function () {
      $("#api").empty();
      showResult("刷新界面失败!!!");
    }
  })
}
// 获取搜索下拉菜单的选项值
function dropdownMenu() {
  $("#dropdownMenu").click(function (event) {
    searchValue = $(event.target).data("menu");
  })
}
// 根据列表填充表格内容
function tableContent(list) {
  var content = "";
  if (list.length > 0) {
    content = "<div class='table-responsive'><table class='table table-bordered text-justify text-wrap'><thead class='thead-dark'><tr><th style=''>#</th>"
      + "<th>API Name</th><th>Description</th><th>Category</th><th>Versions</th></tr></thead><tbody id='api'>";
    $.each(list, function (i, val) {
      content += "<tr data-id=" + list[i].id + "><th><input type='checkbox'></th><td data-toggle='modal' data-target='#exampleModal'>" + list[i].name +
        "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].descriptionBrief + "</td><td data-toggle='modal' data-target='#exampleModal'>"
        + list[i].category + "</td><td data-update-versions='no' data-api-id='" + val.id + "'></td></tr>";
    })
    content += "</tbody></table></div><div id='footerParent'></div>"
  } else {
    content = "<h1>什么都没有发现！</h1>";
  }
  $("#tabone").html(content);
  updateVersionsContent();

}
// 负责控制面板里编辑和删除功能的实现

function APIManager() {
  $("#tabone").click(function (event) {
    var operation = $("#operation .nav-link.active").data("operation");
    var id = $(event.target.parentNode).data("id");
    if (operation == "update") {

      $(".modal-title").text("编辑API");
      $(".modal-body").html(updateAPIModel());
      $("#determine").text("编辑");
      updateAPI(id);
    } else if (operation == "delete") {
      $(".modal-title").text("删除API");
      $(".modal-body").html("<p>您确定要删除这条API吗？</p>");
      $("#determine").text("删除");
      deleteAPI(id);
    } else if (operation == "addVersions") {
      $(".modal-title").text("添加API版本");
      $(".modal-body").html("<p>您确定要为该API添加一个新版本吗？</p>");
      $("#determine").text("确定");
      addVersions(id);
    }
  })
}
// 实现更新API功能
function updateAPI(id) {

  $.ajax({
    url: "http://localhost:8080/api/api/id",
    type: "get",
    data: {
      "id": id
    },
    success: function (data) {
      var updateName = $("#updateName");
      var updateCategory = $("#updateCategory");
      var updateDescriptionBrief = $("#updateDescriptionBrief");
      updateName.val(data.name);
      updateCategory.val(data.category);
      updateDescriptionBrief.text(data.descriptionBrief);
      $("#determine").off();
      $("#determine").click(function () {
        var updateData = {
          "name": updateName.val(),
          "category": updateCategory.val(),
          "descriptionBrief": updateDescriptionBrief.text(),
          "id": data.id
        };
        $.ajax({
          url: "http://localhost:8080/api/api/id",
          type: "put",
          data: JSON.stringify(updateData),
          contentType: "application/json;charset=utf-8;",
          dataType: "json",
          success: function (flag) {
            if (flag) {
              showResult("更新成功!!!");
              reFresh();
            } else {
              showResult("更新失败");
            }

          },
          error: function () {
            showResult("更新失败error");
          }
        })


      })
    },
    error: function () {
      showResult("更新失败!!!");
    }
  })

}
// 实现删除API的功能
function deleteAPI(id) {

  $("#determine").off();
  $("#determine").click(function () {
    $.ajax({
      url: "http://localhost:8080/api/api/id",
      type: "delete",
      data: {
        "id": id
      },
      success: function (flag) {
        if (flag) {
          showResult("删除成功!!!");

        } else {
          showResult("删除失败");
        }
        reFresh();

      },
      error: function () {
        showResult("删除失败");
      }
    })
  })


}
// 实现添加API的功能
function addAPI() {
  $("#addSubmit").click(function () {
    var addName = $("#addName");
    var addCategory = $("#addCategory");
    var addDescriptionBrief = $("#addDescriptionBrief");
    if ($.trim(addName.val()) == "") {
      showResult("请输入值")
      return;
    }
    var addData = {
      "name": $.trim(addName.val()),
      "category": $.trim(addCategory.val()),
      "descriptionBrief": $.trim(addDescriptionBrief.val())
    };
    $.ajax({
      url: "http://localhost:8080/api/api/",
      type: "post",
      data: JSON.stringify(addData),
      contentType: "application/json;charset=utf-8",
      success: function (APIId) {
        addName.val("");
        addCategory.val("");
        addDescriptionBrief.val("");
        sessionStorage.setItem("APIId", APIId);
        sessionStorage.setItem("API", "add");
        window.location.href = "APIUpdate.html";

      },
      error: function () {
        showResult("添加失败error");
      }
    })
  })
}
// 实现添加API新版本的功能
function addVersions(id) {

  $("#determine").off();
  $("#determine").click(function () {
    sessionStorage.setItem("APIId", id);
    sessionStorage.setItem("API", "add");
    window.location.href = "APIUpdate.html";
  })
}

function updateVersionsContent() {
  $("td[data-update-versions='no']").each(function (i, event) {
    var id = $(this).data("api-id");
    $.ajax({
      url: "http://localhost:8080/api/apiVersions/APIId",
      type: "get",
      data: {
        "APIId": id
      },
      success: function (data) {
        console.log(data);
        var versionsContent = "";
        if (data.length == 1) {
          versionsContent = "<a class='text-decoration-none'  href='#'  data-versions-logo='" + data[0].logo + "'  data-versions-id=" + data[0].id + ">" + data[0].versions + "</a>";
        } else if (data.length > 1) {
          versionsContent = "<a  class='dropdown-toggle  text-decoration-none'  data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>选择一个版本</a><div class='dropdown-menu'>"
          $.each(data, function (i, val) {
            versionsContent += "<a class='dropdown-item text-decoration-none' data-versions-logo='" + val.logo + "'  data-versions-id='" + val.id + "'href='#'>" + val.versions + "</a>";
          })
          versionsContent += "</div>";
        } else {

        }
        $(this).data("update-versions", "yes");
        $(event).html(versionsContent)
      }
    })

  })

}

// 绑定点击版本的行为
function ToAPIVersions() {
  $(document).on("click", "a[data-versions-id]", function () {
    var operation = $("#operation .nav-link.active").data("operation");
    if (operation == "update") {
      sessionStorage.setItem("versionsId", $(this).data("versions-id"));
      sessionStorage.setItem("API", "update");
      window.location.href = "APIUpdate.html";
    } else if (operation == "delete") {
      $.ajax({
        url: "http://localhost:8080/api/apiVersions/id",
        type: "delete",
        data: {
          "id": $(this).data("versions-id"),
          "logo": $(this).data("versions-logo")
        },
        success: function (flag) {
          if (flag) {
            alert("成功删除该版本！！！");
          } else {
            alert("删除失败！！！");
          }
          reFresh()
        },
        error: function () {
          alert("连接服务器失败！！！");
        }
      })
    }
  })
}

function updateAPIModel() {
  var content = "<h1 class='mb-4 text-center'>编辑API</h1><form><div class='form-group'> <input type='text' class='form-control' id='updateName' name='name'"
    + "placeholder='API Name' required='required'> </div><div class='form-group'><input type='text' class='form-control'"
    + " id='updateCategory'name='category' placeholder='Category'> </div><div class='form-group'> <textarea class='form-control' id='updateDescriptionBrief' name='descriptionBrief' rows='3'"
    + "placeholder='DescriptionBrief'></textarea> </div></form>"
  return content;
}



function showResult(result) {
  $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
}
