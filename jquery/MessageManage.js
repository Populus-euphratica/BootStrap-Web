 // 定义全局变量方便下面进行页面刷新和实现页面跳转
 var pageNum = 1;
 var searchUrl = "";
 var searchType = "";
 var data1 = "";
 var updatePlace;
 var replyContent = $("#replyContent");
 var operation = "";
 var footerParent = "footerParentComingApply";





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


 $(document).ready(messageManage());
 $(document).ready(messageInit());
 $(document).ready(numInit());
 $(document).ready(clickApply());
 $(document).ready(clickFeedBack());
 $(document).ready(clickAPI());
 $(document).ready(clickAPIVersions());

 // 激发未处理申请事件
 function messageInit() {
   $("#list-comingApply-list").click();
 }
 // 切换面板时更新显示区域
 function messageManage() {
   $("#list-tab").click(function (event) {
     operation = $(event.target).data("operation");
     pageNum = 1;
     if (operation == "comingApply") {
       searchUrl = "http://localhost:8080/api/applyForAdmin/istrue";
       searchType = "get";
       data1 = {
         istrue: false,
         pageNum: pageNum
       }

       footerParent = "footerParentComingApply";
       updatePlace = $("#list-comingApply");
       reFresh()
     } else if (operation == "alreadyApply") {
       searchUrl = "http://localhost:8080/api/applyForAdmin/istrue";
       searchType = "get";
       data1 = {
         istrue: true,
         pageNum: pageNum
       }

       updatePlace = $("#list-alreadyApply");
       footerParent = "footerParentAlreadyApply";
       reFresh()
     } else if (operation == "comingFeedBack") {
       searchUrl = "http://localhost:8080/api/feedBack/istrue";
       searchType = "get";
       data1 = {
         istrue: false,
         pageNum: pageNum
       }
       updatePlace = $("#list-comingFeedBack");
       footerParent = "footerParentComingFeedBack";
       reFresh()
     } else if (operation == "alreadyFeedBack") {
       searchUrl = "http://localhost:8080/api/feedBack/istrue";
       searchType = "get";
       data1 = {
         istrue: true,
         pageNum: pageNum
       }

       updatePlace = $("#list-alreadyFeedBack");
       footerParent = "footerParentAlreadyFeedBack";
       reFresh()
     } else if (operation == "comingAPI") {
       searchUrl = "http://localhost:8080/api/uploadAPI/istrue";
       searchType = "get";
       data1 = {
         "istrue": false,
         pageNum: pageNum
       };
       updatePlace = $("#list-comingAPI");
       footerParent = "footerParentComingAPI";
       reFresh()
     } else if (operation == "alreadyAPI") {
       searchUrl = "http://localhost:8080/api/uploadAPI/istrue";
       searchType = "get";
       data1 = {
         "istrue": true,
         pageNum: pageNum
       };
       updatePlace = $("#list-alreadyAPI");
       footerParent = "footerParentAlreadyAPI";
       reFresh()
     }else if (operation == "comingAPIVersions") {
       searchUrl = "http://localhost:8080/api/uploadVersions/istrue";
       searchType = "get";
       data1 = {
         "istrue": false,
         pageNum: pageNum
       };
       updatePlace = $("#list-comingAPIVersions");
       footerParent = "footerParentComingAPIVersions";
       reFresh()
     } else if (operation == "alreadyAPIVersions") {
       searchUrl = "http://localhost:8080/api/uploadVersions/istrue";
       searchType = "get";
       data1 = {
         "istrue": true,
         pageNum: pageNum
       };
       updatePlace = $("#list-alreadyAPIVersions");
       footerParent = "footerParentAlreadyAPIVersions";
       reFresh()
     }

   })
 }
 // 初始化未处理消息数目
 function numInit() {
   $.ajax({
     url: "http://localhost:8080/api/applyForAdmin/istrue/sum",
     type: "get",
     data: {
       "istrue": false
     },
     success: function (data) {
       if (data > 0) {
         $("#applyNum").html("<span class='badge badge-success badge-pill'>" + data + "</span>");
       }else {
         $("#applyNum").html("");
       }
     }
   });
   $.ajax({
     url: "http://localhost:8080/api/feedBack/istrue/sum",
     type: "get",
     data: {
       "istrue": false
     },
     success: function (data) {
       if (data > 0) {
         $("#feedBackNum").html("<span class='badge badge-success badge-pill'>" + data + "</span>");
       }else {
         $("#feedBackNum").html("");
       }
     }
   });
   $.ajax({
     url: "http://localhost:8080/api/uploadAPI/istrue/sum",
     type: "get",
     data: {
       "istrue": false
     },
     success: function (data) {
       if (data > 0) {
         $("#APINum").html("<span class='badge badge-success badge-pill'>" + data + "</span>")
       }else {
         $("#APINum").html("");
       }
     }
   })
   $.ajax({
     url: "http://localhost:8080/api/uploadVersions/istrue/sum",
     type: "get",
     success: function (data) {
       if (data > 0) {
         $("#APIVersionsNum").html("<span class='badge badge-success badge-pill'>" + data + "</span>")
       }else {
         $("#APIVersionsNum").html("");
       }
     }
   })
 }

 // 更新上传API审核面板内容
 function updateAPIContent(list) {
   var content = "";
   $.each(list, function (i, val) {
       content += "<div class='col-md-12 pb-3'><div class='card'><div class='card-body'><div class='d-flex w-100 justify-content-between'><h5 class='card-title'><strong>" + val.name + "</strong></h5>"
           + "<small>" + val.date + "</small></div><div class='d-flex w-100 justify-content-between'><p>种类：" + val.category + "</p></div>"
           + "<p class='card-text'>简介：" + val.descriptionBrief + "</p><div name='chooseApply' class='d-flex w-100 justify-content-end' data-id='" + val.id + "'data-email='" + val.email + "'data-category='" + val.category
           + "'data-name='" + val.name + "'>";

     if (!data1.istrue) {
       content += "<div><a href='#' data-agree-api='yes' class='card-link'>同意</a><a href='#' data-agree-api='no' class='card-link mr-3'>拒绝</a></div></div></div></div></div>";
     } else {
       if (val.decide) {
         content += "<div><p   class='card-link mr-3'>已同意</p></div></div></div></div></div>";
       } else {
         content += "<div><p   class='card-link mr-3'>已拒绝</p></div></div></div></div></div>";

       }
     }
   })
   content += "<div id='" + footerParent + "'></div>";
   updatePlace.html(content);
 }

 // 更新上传APIVersions审核面板内容
 function updateAPIVersionsContent(list) {
   var content = "";
   $.each(list, function (i, val) {
       content += "<div class='col-md-12 pb-3'><div class='card'><div class='card-body'><h5 class='card-title'><strong>" + val.name + "</strong></h5>"
           + "<div class='d-flex w-100 justify-content-between'><p>种类：" + val.category + "</p><a href='#' data-versions-id='"+val.versionsId+"'data-email='" + val.email + "'>版本：" + val.versions + "</a></div>"
           + "<p class='card-text'>简介：" + val.descriptionBrief + "</p><div class='d-flex w-100 justify-content-end'>";
     if (!data1.istrue) {
       content += "</div></div></div></div>";
     } else {
       if (val.decide) {
         content += "<p   class='card-link mr-3'>已同意</p></div></div></div></div>";
       } else {
         content += "<p   class='card-link mr-3'>已拒绝</p></div></div></div></div>";

       }
     }
   })
   content += "<div id='" + footerParent + "'></div>";
   updatePlace.html(content);
 }
 // 更新申请面板内容
 function updateApplyContent(list) {
   var content = "";
   $.each(list, function (i, val) {
     content += "<div class='col-md-12 pb-3'><div class='card'><div class='card-body'><div class='d-flex w-100 justify-content-between'><h5 class='card-title'><strong>" + "申请管理员" + "</strong></h5>"
       + "<small>" + val.date + "</small></div><div class='d-flex w-100 justify-content-between'><p>名称：" + val.name + "</p><p>邮箱：" + val.email + "</p><p>密码：" + val.password + "</p></div>"
       + "<p class='card-text'>理由：" + val.reason + "</p><div name='chooseApply' class='row justify-content-end' data-id='" + val.id + "'data-name='" + val.name + "'data-email='" + val.email + "'data-password='"
       + val.password + "'>";

     if (!data1.istrue) {
       content += "<a href='#' data-agree-apply='yes' class='card-link'>同意</a><a href='#' data-agree-apply='no' class='card-link mr-3'>拒绝</a></div></div></div></div></div>";
     } else {
       if (val.decide) {
         content += "<div><p   class='card-link'>已同意</p></div></div></div></div></div>";
       } else {
         content += "<div><p   class='card-link mr-3'>已拒绝</p></div></div></div></div></div>";

       }
     }
   })
   content += "<div id='" + footerParent + "'></div>";
   return content;
 }

 // 更新反馈面板内容
 function updateFeedBackContent(list) {
   var content = "";
   $.each(list, function (i, val) {
     content += "<div class='col-md-12 pb-3'><div class='card'><div class='card-body'><div class='d-flex w-100 justify-content-between'><h5 class='card-title'><strong>" + val.theme + "</strong></h5>"
       + "<small>" + val.date + "</small></div><p class='card-text'>反馈内容：" + val.content + "</p><div  class='row justify-content-end'><p class='text-muted'>——来自" + val.company + "的" + val.name + "</p></div>"
       + "<div  class='row justify-content-end' data-id='" + val.id + "' data-email='" + val.email + "'>";

     if (!data1.istrue) {
       content += "<a href='#' data-agree-reply='yes' class='card-link'>回复</a><a href='#' data-agree-reply='no' class='card-link'>忽略</a></div></div></div></div></div>"
     } else {
       if (val.decide) {
         content += "<div><p   class='card-link'>已回复</p></div></div></div></div></div>";
       } else {
         content += "<div><p   class='card-link mr-3'>已忽略</p></div></div></div></div></div>";

       }
     }
   })

   content += "<div id='" + footerParent + "'></div>";
   return content;
 }
 // 申请面板点击处理逻辑
 function clickApply() {
   $(document).on("click", "#list-comingApply a[data-agree-apply]", function () {
     var apply = $(this.parentNode);
     var choose = $(this).data("agree-apply");
     var str = "";
     var istrue = true;
     if (choose === "yes") {
       str = "恭喜您，经过我们审核，您满足成为管理员的条件，您现已获得管理员身份！";
       istrue = true;
     } else {
       str = "对不起，经过我们审核，您尚不满足成为管理员的条件！";
       istrue = false;
     }
     replyContent.val(str);
     applyManage(apply, istrue);
   })
 }
 // 审核API面板点击处理逻辑
 function clickAPI() {
   $(document).on("click", "#list-comingAPI a[data-agree-api]", function () {
     var api = $(this.parentNode.parentNode);
     var choose = $(this).data("agree-api");
     var str = "";
     var istrue = true;
     if (choose == "yes") {
       str = "<h1>恭喜您</h1><p>您提交的<br />名为：" + api.data("name") + "<br />类别：" + api.data("category") + "<br />顺利通过我们审核，现已成功加入到API数据库，感谢您！</p>";
       istrue = true;
     } else {
       str = "<h1>对不起</h1><p>您提交的<br />名为：" + api.data("name") + "<br />类别：" + api.data("category") + "<br />未能通过我们审核！";
       istrue = false;
     }
     replyContent.val(str);
     APIManage(api, istrue);
   })
 }

 // 审核APIVersions面板点击处理逻辑
 function clickAPIVersions() {
   $(document).on("click", "#list-comingAPIVersions a[data-versions-id]", function () {
     alert(123)
      sessionStorage.setItem("email",$(this).data("email"));
      sessionStorage.setItem("versionsId",$(this).data("versions-id"));
      window.location.href="AdminAPIUpdate.html";
   })
 }
 // 反馈面板点击处理逻辑
 function clickFeedBack() {
   $(document).on("click", "#list-comingFeedBack a[data-agree-reply]", function () {
     var apply = $(this.parentNode);
     var choose = $(this).data("agree-reply");
     var id = apply.data("id");
     var email = apply.data("email");
     var istrue = true;
     if (choose === "yes") {
       istrue = true;
     } else {
       istrue = false;
     }
     replyContent.val("我们很重视您的反馈，我们会认真考虑并作出改进的！再次感谢您提出的宝贵意见。")
     feedBackManage(email, istrue, id);

   })
 }
 // 实现发送邮件以及更新feedBack数据库记录
 function feedBackManage(email, istrue, id) {
   $('#exampleModal').modal('show');
   $("#determine").off();
   $("#determine").click(function () {
     if (!istrue) {
       replyContent.val("")
     }
     $.ajax({
       url: "http://localhost:8080/api/feedBack/reply",
       type: "put",
       data: {
         "reply": replyContent.val(),
         "decide":istrue,
         "id": id
       },
       success: function (falg) {
         if (falg) {
           alert("添加成功!");
           // if (!istrue) {
           //   return;
           // }
           var emailData = {
             "content": replyContent.val(),
             "to": email
           };
           sendEmail(emailData);
         } else {
           alert("更新失败!");
         }
       }, error: function () {
         alert("连接服务器失败")
       }
     })

   })

 }
 // 实现发送邮件以及更新apply数据库记录
 function applyManage(apply, istrue) {
   $('#exampleModal').modal('show');
   $("#determine").off();
   $("#determine").click(function () {
     if (istrue) {
       $.ajax({
         url: "http://localhost:8080/api/admin/email",
         type: "get",
         data: {
           "email": $.trim(apply.data("email"))
         },
         success: function (emailDate) {
           if (emailDate.id != null) {
             emailNote.text("该邮箱已被其他人使用");
             email.focus();
             return;
           } else {

             var adminData = {
               "name": apply.data("name"),
               "email": apply.data("email"),
               "password": apply.data("password")
             };
             $.ajax({
               url: "http://localhost:8080/api/admin/apply?id=" + apply.data("id"),
               type: "post",
               data: JSON.stringify(adminData),
               contentType: "application/json;charset=utf-8",
               // dataType: "json",
               success: function (falg) {
                 if (falg) {
                   alert("添加成功!");
                   var emailData = {
                     "content": replyContent.val(),
                     "to": apply.data("email")
                   };
                   sendEmail(emailData);
                 } else {
                   alert("添加失败!");
                 }
               },
               error: function () {
                 alert("连接服务器失败!");
               }
             })
           }
         },
         error: function () {
           alert("连接服务器失败!");
         }
       })

     }
     else {

       $.ajax({
         url: "http://localhost:8080/api/applyForAdmin/id",
         type: "put",
         data: {
           "id": apply.data("id")
         },
         success: function (falg) {
           if (falg) {
             alert("操作成功！")
           } else {
             alert("操作失败！")
           }
         },
         error: function () {
           alert("连接服务器失败!");
         }
       })
       var emailData = {
         "content": replyContent.val(),
         "to": apply.data("email")
       };
       sendEmail(emailData);
     }
   })
 }

 // 实现发送邮件以及更新API数据库记录
 function APIManage(api, istrue) {
   $('#exampleModal').modal('show');
   $("#determine").off();
   $("#determine").click(function () {
     if (istrue) {
       $.ajax({
         url: "http://localhost:8080/api/api/uploadAPI",
         type: "post",
         data: {
           "id": api.data("id")
         },
         success: function (flag) {
           if (flag) {
             var emailData = {
               "content": replyContent.val(),
               "to": api.data("email")
             };
             sendEmail(emailData);
           } else {
             alert("添加失败!");
           }
         },
         error: function () {
           alert("连接服务器失败!");
         }
       })
     }
     else {
       $.ajax({
         url: "http://localhost:8080/api/uploadAPI/id",
         type: "put",
         data: {
           "id": api.data("id")
         },
         success: function (falg) {
           if (falg) {
             alert("操作成功！")
           } else {
             alert("操作失败！")
           }
         },
         error: function () {
           alert("连接服务器失败!");
         }
       })
       var emailData = {
         "content": replyContent.val(),
         "to": api.data("email")
       };
       sendEmail(emailData);
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
   reFresh();
 }


 // 获取申请的分页数据
 function updateContent() {
   numInit();
   messageNum();
   $.ajax({
     url: searchUrl,
     type: searchType,
     data: data1,
     success: function (data) {
       if (data.total != 0) {
         if (operation == "comingApply" || operation == "alreadyApply") {
           updatePlace.html(updateApplyContent(data.list));
         } else if (operation == "comingFeedBack" || operation == "alreadyFeedBack") {
           updatePlace.html(updateFeedBackContent(data.list));
         } else if (operation == "comingAPI" || operation == "alreadyAPI") {
           updateAPIContent(data.list);
         }else if (operation == "comingAPIVersions" || operation == "alreadyAPIVersions"){
           updateAPIVersionsContent(data.list);
         }

         if (data.pages > 1) {
           footerContent(data.pageNum, data.hasPreviousPage, data.hasNextPage, data.navigatepageNums, $("#" + footerParent + ""));
           footerEnterAPI();
         }
       } else {
         updatePlace.html("<h1>这里什么都没有，去别的地方看看吧</h1>");
       }
     },
     error: function () {
       return false;
     }
   })
 }


 // 实现页脚在界面的显示
 function footerContent(pageNum, hasPreviousPage, hasNextPage, navigatepageNums, footer) {
   var content = "<ul class='pagination justify-content-center' data-footer='footer'>";
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
   footer.html(content)
 }
 // 实现根据页脚进行跳转的功能
 function footerEnterAPI() {
   $("ul[data-footer]").click(function (event) {
     pageNum = $(event.target).data("pagenum");
     data1.pageNum = pageNum;
     reFresh();
   })
 }
 // 刷新界面
 function reFresh() {
   if (!updateContent()) {
     updatePlace.html("");
   }
 }