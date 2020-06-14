// 登录的用户信息初始化
var stateData = JSON.parse(sessionStorage.getItem("stateData"));

// 定义全局变量方便下面进行页面刷新和实现页面跳转
var pageNum = 1;
var pageSize = 8;
var searchUrl = "";
var searchType = "";
var searchValue = "";
var data1 = {};
var concernCacheDate = [];
var rowCacheDate = [];



$(document).ready(init());


function init() {

    var state = sessionStorage.getItem("state");
    var login = sessionStorage.getItem("login");
    if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData) || state != "user") {
        window.location.href = "Login.html";
    }

    $("#state").html("<i class='fa fa-user-circle-o d-inline fa-lg' aria-hidden='true'></i>" + stateData.name);
}



// 实现搜索功能
function search() {

  $("#Serchfrom").submit(function (e) {
    e.preventDefault();
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
      searchInit("http://localhost:8080/api/api/recommend/");
    } else if (searchValue == "name") {
      searchUrl = "http://localhost:8080/api/api/name";
      searchType = "get";
      data1 = {
        "name": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
      searchInit("http://localhost:8080/api/api/recommend/name");
    } else if (searchValue == "category") {
      searchUrl = "http://localhost:8080/api/api/category";
      searchType = "get";
      data1 = {
        "category": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
      searchInit("http://localhost:8080/api/api/recommend/category");
    } else {
      searchUrl = "http://localhost:8080/api/api/all";
      searchType = "get";
      data1 = {
        "val": searchContent,
        "pageNum": pageNum,
        "pageSize": pageSize
      };
      ajaxAPI(data1);
      alert("123")
      searchInit("http://localhost:8080/api/api/recommend/all");
    }
  });
}
$(document).ready(concernCache());
$(document).ready(dropdownMenu());

$(document).ready(search());
$(document).ready(searchClickInit());
$(document).ready(searchCollectionInit());
$(document).ready(cancelConcern());
$(document).ready(ToAPIVersions());
$(document).ready(historyRecommend());

// 实现与服务器的沟通，主要为了减少代码量
function ajaxAPI(data1) {
  $.ajax({
    url: searchUrl,
    type: searchType,
    data: data1,
    success: function (data) {
      cardContent($("#api"), data.list);
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
          content += "<li class='page-item active'> <a class='page-link'  data-pagenum=" + val + ">" + val + "</a></li>"
        }
      } else {
        content += "<li class='page-item'> <a class='page-link'  data-pagenum=" + val + ">" + "Next" + "</a></li>"
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
      cardContent($("#api"), data.list);
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
// 根据列表填充卡片内容
function cardContent(place, list) {
  var content = "";
  var index;
  var rowIndex = 0;
  $.each(list, function (i, val) {
    if (i % 4 == 0) {
      content += "<div class=' py-3'>"
      // content += "<div class='row'>"
      content += "<div class='card-deck'>";
    }
    content += "<div class='card' data-id=" + list[i].id + "><div class='card-body'><h5 class='card-title'><strong>" + list[i].name + "</strong></h5>"
      + "<h6 class='card-subtitle my-2 text-muted'>" + list[i].category + "</h6>"
      + "<p class='card-text'>" + list[i].descriptionBrief + "</p></div>"
      + "<div class='card-footer'><div class='d-flex w-100 justify-content-between align-items-center'><div  class='text-muted' data-update-versions='no' data-api-id='"+val.id+"'></div>";


    for (j = 0; j < rowCacheDate.length; j++) {
      if (rowCacheDate[j] == val.id) {
        index = j;
        break;
      }
    }
    if (index >= 0) {
      content += "<button class='btn btn-primary btn-icon rounded' type='button' data-btn='concern' data-concern='true' data-concern-id='" + concernCacheDate[index] + "' data-id=" + val.id + "><i class='fa fa-heart fa-lg'></i></button></div></div></div>";
    } else {
      content += "<button class='btn btn-primary btn-icon rounded' type='button' data-btn='concern' data-concern='false' data-id=" + val.id + "><i class='fa fa-heart-o fa-lg'></i></button></div></div></div>";
    }
    index = -1;
    if ((i + 1) % 4 == 0) {
      content += "</div></div>";
    }

  })


  if (place.is($("#api"))) {
    content += "<div id='footerParent'></div>";
  }

  place.html(content);
  updateVersionsContent()
}

function updateVersionsContent(){
  $("div[data-update-versions='no']").each(function(i,event){
    var id=$(this).data("api-id");
    $.ajax({
      url: "http://localhost:8080/api/apiVersions/APIId",
      type: "get",
      data: {
        "APIId": id
      },
      success: function (data) {
        var versionsContent = "";
        if (data.length == 1) {
          versionsContent = "<a class='card-link stretched-link'  href='#' data-versions-id=" + data[0].id + ">" + data[0].versions + "</a>";
        } else if (data.length > 1) {
          versionsContent="<a  class='dropdown-toggle  card-link'  data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>选择一个版本</a><div class='dropdown-menu'>"
          $.each(data, function (i, val) {
            versionsContent+="<a class='dropdown-item stretched-link' data-versions-id='" + val.id + "'href='#'>"+val.versions+"</a>";
          })
          versionsContent += "</div>";
        }
        $(this).data("update-versions","yes");
        $(event).html(versionsContent)
      }
    })
    
  })
  
}

function ToAPIVersions(){
  $(document).on("click","a[data-versions-id]",function(e){
    sessionStorage.setItem("versionsId",$(this).data("versions-id"));
    var id = $(e.target).parents(".card").data("id");
    if (typeof (id) == "undefined" || id == null) {
      return false;
    }
    updateClickNum(id);
    addHistory(id);
    window.location.href = "API.html";
  })
}
//更新用户关注缓存
function concernCache() {
  $.ajax({
    url: "http://localhost:8080/api/userConcern/userId/all",
    type: "get",
    data: {
      userId: stateData.id
    },
    success: function (data) {
      $.each(data, function (i, val) {
        rowCacheDate.push(val.userConcern);
        concernCacheDate.push(val.id);
      })
    }
  })
}



function showResult(result) {
  // $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
  alert(result);
}
// 根据点击量进行推荐
function searchClickInit() {
  var apiClick = $("#apiClick");

  $.ajax({
    url: "http://localhost:8080/api/api/recommend/clickNum",
    type: "get",
    success: function (data) {
      if (data != null && data.length != 0) {
        cardContent(apiClick, data);
        apiClick.prepend("<h3>点击量排名</h3>");
      }
    }
  })
}
// 根据收藏量进行推荐
function searchCollectionInit() {
  var apiCollectionInit = $("#apiCollection");

  $.ajax({
    url: "http://localhost:8080/api/api/recommend/collectionNum",
    type: "get",
    success: function (data) {
      if (data != null && data.length != 0) {
        cardContent(apiCollectionInit, data);
        apiCollectionInit.prepend("<h3>收藏量排名</h3>");
      }
    }
  })
}

// 用户收藏或取消
function cancelConcern() {
  $(document).on("click", "button[data-btn='concern']", function () {
    var btn = $(this);
    var istrue = btn.data("concern");
    if (istrue === true) {
      $.ajax({
        url: "http://localhost:8080/api/userConcern/id",
        type: "delete",
        data: {
          "id": btn.data("concern-id")
        },
        success: function (flag) {
          if (flag) {
            btn.data("concern", false);
            btn.data("concern-id", null);
            btn.html("<i class='fa fa-heart-o fa-lg' aria-hidden='true'></i>");
            concernCache();
          }
        }
      })
    } else if (istrue === false) {
      $.ajax({
        url: "http://localhost:8080/api/userConcern/",
        type: "post",
        data: JSON.stringify({
          "userId": stateData.id,
          "userConcern": btn.data("id"),
          "date":getDate()
        }),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
          btn.data("concern", true);
          btn.data("concern-id", data);
          btn.html("<i class='fa fa-heart fa-lg' aria-hidden='true'></i>");
          concernCache();
        }
      })
    }
  })
}
// 根据搜索类型选择最多相关种类进行推荐
function searchInit(url) {
  var apiCategory = $("#apiCategory");
  $.ajax({
    url: url,
    type: "get",
    success: function (data) {
      if (data != null && data.length != 0) {
        cardContent(apiCategory, data);
        console.log(data)
        apiCategory.prepend("<h3>相关推荐</h3>");
      }
    }
  })
}

function updateClickNum(id) {

    $.ajax({
      url: "http://localhost:8080/api/apiInfo/id/clickNum",
      type: "put",
      data: {
        "id": parseInt(id)
      },
      success: function () {

      },
      error: function () {
        showResult("updateClickNum失败！");
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

function addHistory(apiId) {
  $.ajax({
    url:"http://localhost:8080/api/history/",
    type:"post",
    contentType: "application/json;charset=utf-8",
    data:JSON.stringify({
      "userId":stateData.id,
      "apiId":apiId,
      "date":getDate()
    }),
    success:function (flag) {
    }
  })
}

function historyRecommend() {
  $.ajax({
    url: "http://localhost:8080/api/history/userId",
    type: "get",
    data:{
      "userId":stateData.id
    },
    success: function (data) {
      if (data != null && data.length != 0) {
        cardContent($(".modal-body"), data);
        $('#modal1').modal('show');
      }

    }
  })
}
