

// 定义全局变量方便下面进行页面刷新和实现页面跳转
var pageNum = 1;
var searchUrl = "";
var searchType = "";
var searchValue = "";
var data1 = {};
// 实现搜索功能
function search() {

  $("#search").click(function () {
    var searchContent = $("#searchContent").val();
    if (searchContent == "") {
      searchUrl = "http://localhost:8080/api/api/";
      searchType = "get";
      data1 = {
        "pageNum": pageNum
      };
      ajaxAPI(data1);
    } else if (searchValue == "name") {
      searchUrl = "http://localhost:8080/api/api/name";
      searchType = "get";
      data1 = {
        "name": searchContent,
        "pageNum": pageNum
      };
      ajaxAPI(data1);
    } else if (searchValue == "category") {
      searchUrl = "http://localhost:8080/api/api/category";
      searchType = "get";
      data1 = {
        "category": searchContent,
        "pageNum": pageNum
      };
      ajaxAPI(data1);
    } else {
      searchUrl = "http://localhost:8080/api/api/all";
      searchType = "get";
      data1 = {
        "val": searchContent,
        "pageNum": pageNum
      };
      ajaxAPI(data1);
    }
  });
}
$(document).ready(dropdownMenu());
$(document).ready(search());
$(document).ready(addAPI());
$(document).ready(APIManager());
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
  $("#footerParent").html(content)
}
// 实现根据页脚进行跳转的功能
function footerEnterAPI(data1) {
  $("#footer").click(function (event) {
    pageNum = $(event.target).data("pagenum");
    reFresh(data1);
  })
}
// 刷新界面
function reFresh(data1) {
  data1.pageNum = pageNum;
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
  $.each(list, function (i, val) {
    content += "<tr data-id=" + list[i].id + "><th><input type='checkbox'></th><td data-toggle='modal' data-target='#exampleModal'>" + list[i].name +
      "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].descriptionBrief + "</td><td data-toggle='modal' data-target='#exampleModal'>"
      + list[i].category + "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].versions + "</td></tr>";
  })
  $("#api").html(content);
  $("#footerParent").empty();

}
// 负责控制面板里编辑和删除功能的实现

function APIManager() {
  $("#api").click(function (event) {
    var operation = $("#operation .nav-link.active").data("operation");
    var id = $(event.target.parentNode).data("id");
    if (operation == "update") {
      updateAPI(id);
    } else if (operation == "delete") {
      deleteAPI(id);
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
      var updateDescription = $("#updateDescription");
      var updateVersions = $("#updateVersions");
      updateName.val(data.name);
      updateCategory.val(data.category);
      updateVersions.val(data.versions);
      updateDescription.text(data.description);
      $("#determine").off();
      $("#determine").click(function () {
        var updateData = {
          "name": updateName.val(),
          "category": updateCategory.val(),
          "versions": updateVersions.val(),
          "description": updateDescription.text(),
          "id": data.id
        };
        if (updateData.description.length == 0) {
          updateData.descriptionBrief = "";
        } else if (updateData.description.length > 300) {
          updateData.descriptionBrief = updateData.description.substring(0, 200) + "...";
        } else {
          updateData.descriptionBrief = updateData.description;
        }
        data = {};
        $.ajax({
          url: "http://localhost:8080/api/api/id",
          type: "put",
          data: JSON.stringify(updateData),
          contentType: "application/json;charset=utf-8;",
          dataType: "json",
          success: function (flag) {
            if (flag) {
              showResult("更新成功!!!");
              reFresh(data1);
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

  $(".modal-title").val = "删除API";
  $(".modal-body").html("<p>您确定要删除这条API吗？</p>");
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
          reFresh(data1);
        } else {
          showResult("删除失败");
        }

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
    var addDescription = $("#addDescription");
    var addVersions = $("#addVersions");
    if (addName.val() == "") {
      showResult("请输入值")
      return;
    }
    var addData = {
      "name": addName.val(),
      "category": addCategory.val(),
      "versions": addVersions.val(),
      "description": addDescription.val()
    };
    if (addData.description.length == 0) {
      addData.descriptionBrief = "";
    } else if (addData.description.length > 300) {
      addData.descriptionBrief = addData.description.substring(0, 200) + "...";
    } else {
      addData.descriptionBrief = addData.description;
    }
    $.ajax({
      url: "http://localhost:8080/api/api/",
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

function showResult(result) {
  $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
}
