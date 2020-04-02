 // 定义全局变量方便下面进行页面刷新和实现页面跳转
 var pageNum = 1;
 var searchUrl = "";
 var searchType = "";
 var searchValue = "";
 var data1 = {};

// 登录的管理员信息初始化
var stateData = JSON.parse(sessionStorage.getItem("stateData"));
$(document).ready(init());
 $(document).ready( onClickDate());
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
function messageNum(){
 $.ajax({
   url:"http://localhost:8080/api/admin/message/sum",
   type:"get",
   success:function(messageNum){
     if(messageNum>0){
       $("#message").html("<i class='fa fa-bell-o' aria-hidden='true'></i>Message");
     }
   }
 })
}


 function onClickDate() {
   $("a[data-menu='dateSection']").on("click",function () {
     $('#modal').modal('show');
   })
   $("#ok").click(function () {
     searchUrl = "http://localhost:8080/api/apiNews/dateSection";
     searchType = "get";
     data1 = {
       "date1": $("#dateStart").val(),
       "date2":$("#dateEnd").val(),
       "pageNum": pageNum
     };
     console.log(data1);
     ajaxAPI(data1);
   })
 }

 // 实现搜索功能
 function search() {

   $("#search").click(function () {
     var searchContent = $.trim($("#searchContent").val());
     pageNum = 1;
     if (searchContent == "") {
       searchUrl = "http://localhost:8080/api/apiNews/";
       searchType = "get";
       data1 = {
         "pageNum": pageNum
       };
       ajaxAPI(data1);
     } else if (searchValue == "name") {
       searchUrl = "http://localhost:8080/api/apiNews/name";
       searchType = "get";
       data1 = {
         "name": searchContent,
         "pageNum": pageNum
       };
       ajaxAPI(data1);
     } else if (searchValue == "author") {
       searchUrl = "http://localhost:8080/api/apiNews/author";
       searchType = "get";
       data1 = {
         "author": searchContent,
         "pageNum": pageNum
       };
       ajaxAPI(data1);
     } else if (searchValue == "category") {
       searchUrl = "http://localhost:8080/api/apiNews/category";
       searchType = "get";
       data1 = {
         "category": searchContent,
         "pageNum": pageNum
       };
       ajaxAPI(data1);
     } else if (searchValue == "date") {
       searchUrl = "http://localhost:8080/api/apiNews/data";
       searchType = "get";
       data1 = {
         "date": searchContent,
         "pageNum": pageNum
       };
       ajaxAPI(data1);
     } else {
       searchUrl = "http://localhost:8080/api/apiNews/all";
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
 $(document).ready(addAPINews());
 $(document).ready(APINewsManager());

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
       $("#tab1").empty();
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
   messageNum();
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
       $("#tab1").empty();
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
   var content = "<ul class='list-group list-group-flush'>";
   $.each(list, function (i, val) {
     content += "<li class='list-group-item list-group-item-action' data-id=" + val.id + "><div class='d-flex w-100 justify-content-between'><h5 class='mb-1'>" + val.name + "</h5>"
       + "<small>" + val.date + "</small></div><p class='mb-1'>" + val.contentBrief + "</p><div class='d-flex w-100 justify-content-between'><small>" + val.author + "</small><small>" + val.category + "</small></div></li>";
   })
   content += "</ul>"
   $("#tab1").html(content);
   $("#footerParent").empty();

 }
 // 负责控制面板里编辑和删除功能的实现

 function APINewsManager() {
   $("#tab1").click(function (event) {
     var operation = $("#operation .nav-link.active").data("operation");
     var id = $(event.target).parents("li").data("id");
     if (operation == "update") {
       $(".modal-title").text("编辑API资讯");
       $(".modal-body").html(updateAPINewsModel());
       $("#determine").text("编辑");
       updateAPINews(id);
     } else if (operation == "delete") {
       $(".modal-title").text("删除API资讯");
       $(".modal-body").html("<p>您确定要删除这条API资讯吗？</p>");
       $("#determine").text("删除");
       deleteAPINews(id);
     } else if (operation == "add") {
       addAPINews();
     }
   })
 }





 // 实现更新API功能
 function updateAPINews(id) {

   $.ajax({
     url: "http://localhost:8080/api/apiNews/id",
     type: "get",
     data: {
       "id": id
     },
     success: function (apiNews) {

       var updateName = $("#updateName");
       var updateCategory = $("#updateCategory");
       var updateAuthor = $("#updateAuthor");
       var updateDate = $("#updateDate");
       var updateContent = $("#updateContent");
       updateName.val(apiNews.name);
       updateCategory.val(apiNews.category);
       updateAuthor.val(apiNews.author);
       updateDate.val(apiNews.date);
       updateContent.text(apiNews.content);

       $('#exampleModal').modal('show');
       $("#determine").off();
       $("#determine").click(function () {
         if (!check(updateName, updateCategory, updateAuthor, updateDate, "update")) {
           return false;
         }
         var updateData = {
           "name": updateName.val(),
           "category": updateCategory.val(),
           "author": updateAuthor.val(),
           "date": updateDate.val(),
           "content": updateContent.text()
         };
         if (updateData.content.length == 0) {
           updateData.contentBrief = "";
         } else if (updateData.content.length > 300) {
           updateData.contentBrief = updateData.content.substring(0, 200) + "...";
         } else {
           updateData.contentBrief = updateData.content;
         }
         apiNews = {};
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
 function deleteAPINews(id) {


   $("#determine").off();
   $('#exampleModal').modal('show');
   $("#determine").click(function () {
     $.ajax({
       url: "http://localhost:8080/api/apiNews/id",
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
 function addAPINews() {
   $("#addFrom").submit(function (event) {
     event.preventDefault();
     var addName = $("#addName");
     var addCategory = $("#addCategory");
     var addAuthor = $("#addAuthor");
     var addDate = $("#addDate");
     var addContent = $("#addContent");

     var addData = {
       "name": $.trim(addName.val()),
       "category": $.trim(addCategory.val()),
       "author": $.trim(addAuthor.val()),
       "date": $.trim(addDate.val()),
       "content": $.trim(addContent.val())
     };
     if (!check(addName, addCategory, addAuthor, addDate, "add")) {
       return false;
     }
     if (addData.content.length == 0) {
       addData.contentBrief = "";
     } else if (addData.content.length > 300) {
       addData.contentBrief = addData.content.substring(0, 200) + "...";
     } else {
       addData.contentBrief = addData.content;
     }

     $.ajax({
       url: "http://localhost:8080/api/apiNews/",
       type: "post",
       data: JSON.stringify(addData),
       contentType: "application/json;charset=utf-8",
       dataType: "text",
       success: function (flag) {
         addName = "";
         addCategory = "";
         addAuthor = "";
         addDate = "";
         addContent = "";
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


 function check(name, category, author, date, manager) {
   var nameNote;
   var categoryNote;
   var dateNote;
   var authorNote;

   if (manager == "update") {
     nameNote = $("#nameNote2");
     categoryNote = $("#categoryNote2");
     dateNote = $("#dateNote2");
     authorNote = $("#authorNote2");
   } else {
     nameNote = $("#nameNote1");
     categoryNote = $("#categoryNote1");
     dateNote = $("#dateNote1");
     authorNote = $("#authorNote1");
   }

   if ($.trim(name.val()) == "") {
     name.focus();
     nameNote.text("请输入名称!");
     return false;
   }
   nameNote.text("");

   if ($.trim(category.val()) == "") {
     category.focus();
     categoryNote.text("请输入类别!");
     return false;
   }
   categoryNote.text("");

   if ($.trim(date.val()) == "") {
     date.focus();
     dateNote.text("请输入日期!");
     return false;
   }
   dateNote.text("");

   if ($.trim(author.val()) == "") {
     author.focus();
     authorNote.text("请输入作者!");
     return false;
   }
   authorNote.text("");

   return true;
 }


 function updateAPINewsModel() {
   var content = "<h1 class='mb-4 text-center'>编辑资讯</h1><form><div class='form-group'> <input type='text' class='form-control' id='updateName' placeholder='资讯名称'"
     + "required='required'> <small id='nameNote2'></small></div><div class='form-group'> <input type='text' class='form-control' id='updateCategory' placeholder='资讯类别'"
     + "required='required'><small id='categoryNote2'></small> </div><div class='form-row'><div class='form-group col-md-6'> <input type='text' class='form-control' id='updateAuthor'"
     + "placeholder='作者'></div><small id='authorNote2'></small><div class='form-group col-md-6'> <input type='date' class='form-control' id='updateDate'placeholder='时间'>"
     + "</div><small id='dateNote2'></small></div><div class='form-group'> <textarea class='form-control' id='updateContent' rows='15'placeholder='正文内容'></textarea>"
     + "</div></form>";
   return content;
 }


 function showResult(result) {
   $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
 }