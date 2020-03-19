

  // 定义全局变量方便下面进行页面刷新和实现页面跳转
  var pageNum = 1;
  var searchUrl = "";
  var searchType = "";
  var searchValue = "";
  var data1 = {};

  // 登录的管理员信息初始化
  var stateData = JSON.parse(sessionStorage.getItem("stateData"));
  $(document).ready(init());
  function init() {

    var login = sessionStorage.getItem("login");
    if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData)) {
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

  // 实现搜索功能
  function search() {

    $("#search").click(function () {
      var searchContent = $.trim($("#searchContent").val());
      pageNum = 1;
      if (searchContent == "") {
        searchUrl = "http://localhost:8080/api/user/";
        searchType = "get";
        data1 = {
          "pageNum": pageNum
        };
        ajaxAPI(data1);
      } else if (searchValue == "name") {
        searchUrl = "http://localhost:8080/api/user/name";
        searchType = "get";
        data1 = {
          "name": searchContent,
          "pageNum": pageNum
        };
        ajaxAPI(data1);
      } else if (searchValue == "company") {
        searchUrl = "http://localhost:8080/api/user/company";
        searchType = "get";
        data1 = {
          "company": searchContent,
          "pageNum": pageNum
        };
        ajaxAPI(data1);
      } else if (searchValue == "email") {
        searchUrl = "http://localhost:8080/api/user/email";
        searchType = "get";
        data1 = {
          "email": searchContent
        };
        ajaxAPI(data1);
      } else {
        searchUrl = "http://localhost:8080/api/user/all";
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
  $(document).ready(addUser());
  $(document).ready(userManager());
  // 实现与服务器的沟通，主要为了减少代码量
  function ajaxAPI(data1) {
    $.ajax({
      url: searchUrl,
      type: searchType,
      data: data1,
      success: function (data) {
        if (searchValue == "email") {
          tableContent({ data });
          return;
        } else {
          tableContent(data.list);
        }
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
    $.each(list, function (i, val) {
      content += "<tr data-id=" + list[i].id + "><th><input type='checkbox'></th><td data-toggle='modal' data-target='#exampleModal'>" + list[i].name +
        "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].company + "</td><td data-toggle='modal' data-target='#exampleModal'>"
        + list[i].email + "</td><td data-toggle='modal' data-target='#exampleModal'>" + list[i].password + "</td></tr>";
    })
    $("#api").html(content);
    $("#footerParent").empty();

  }
  // 负责控制面板里编辑和删除功能的实现

  function userManager() {
    $("#api").click(function (event) {
      var operation = $("#operation .nav-link.active").data("operation");
      var id = $(event.target.parentNode).data("id");
      if (operation == "update") {
        $(".modal-title").text("编辑用户");
        $(".modal-body").html(updateUserModel());
        $("#determine").text("编辑");
        updateUser(id);
      } else if (operation == "delete") {
        $(".modal-title").text("删除用户");
        $(".modal-body").html("<p>您确定要删除该用户吗？</p>");
        $("#determine").text("删除");
        deleteUser(id);
      }
    })
  }
  // 实现更新User功能
  function updateUser(id) {

    $.ajax({
      url: "http://localhost:8080/api/user/id",
      type: "get",
      data: {
        "id": id
      },
      success: function (data) {
        var updateName = $("#updateName");
        var updateCompany = $("#updateCompany");
        var updateEmail = $("#updateEmail");
        var updatePassword = $("#updatePassword");
        var updateConfirmPassword = $("#updateConfirmPassword");
        updateName.val(data.name);
        updateCompany.val(data.company);
        updateEmail.val(data.email);
        updatePassword.val(data.password);
        updateConfirmPassword.val(data.password);
        $("#determine").off();
        $("#determine").click(function () {
          var updateData = {
            "name": updateName.val(),
            "company": updateCompany.val(),
            "email": updateEmail.val(),
            "password": updatePassword.val(),
            "id": id
          };
          if (!check(updateName, updateEmail, updatePassword, updateConfirmPassword, "update")) {
            return false;
          }
          $.ajax({
            url: "http://localhost:8080/api/user/email",
            type: "get",
            data: {
              "email": updateEmail.val()
            },
            success: function (emailDate) {
              if (emailDate.id != null && emailDate.id != id) {
                $("#emailNote2").text("该邮箱已被其他人使用");
                updateName.focus();
                return false;
              } else {
                $.ajax({
                  url: "http://localhost:8080/api/user/id",
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
  // 实现删除User的功能
  function deleteUser(id) {


    $("#determine").off();
    $("#determine").click(function () {
      $.ajax({
        url: "http://localhost:8080/api/user/id",
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
  // 实现添加User的功能
  function addUser() {
    $("#addFrom").submit(function (e) {
      e.preventDefault();
      var addName = $("#addName");
      var addCompany = $("#addCompany");
      var addEmail = $("#addEmail");
      var addPassword = $("#addPassword");
      var addConfirmPassword = $("#addConfirmPassword");

      var addData = {
        "name": $.trim(addName.val()),
        "company": $.trim(addCompany.val()),
        "email": $.trim(addEmail.val()),
        "password": $.trim(addPassword.val()),
      };
      if (!check(addName, addEmail, addPassword, addConfirmPassword, "add")) {
        return false;
      }
      $.ajax({
        url: "http://localhost:8080/api/user/email",
        type: "get",
        data: {
          "email": $.trim(addEmail.val())
        },
        success: function (emailDate) {
          if (emailDate.id != null) {
            $("#emailNote1").text("该邮箱已被其他人使用");
            addEmail.focus();
            return false;
          } else {
            $.ajax({
              url: "http://localhost:8080/api/user/",
              type: "post",
              data: JSON.stringify(addData),
              contentType: "application/json;charset=utf-8",
              dataType: "text",
              success: function (flag) {
                addName.val("");
                addCompany.val("");
                addEmail.val("");
                addPassword.val("");
                addConfirmPassword.val("");
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
          }
        },
        error: function () {
          showResult("更新失败error");
        }
      })

    })
  }

  function check(name, email, password, confirmPassword, manager) {
    var emailNote = $("#emailNote1");
    var passwordNote = $("#passwordNote1");
    var nameNote = $("#nameNote1");
    if (manager == "update") {
      var emailNote = $("#emailNote2");
      var passwordNote = $("#passwordNote2");
      var nameNote = $("#nameNote2");
    }

    if ($.trim(name.val()) == "") {
      name.focus();
      nameNote.text("请输入名称!");
      return false;
    }
    nameNote.text("");
    var rep = /^[a-zA-Z0-9]+@(\d{3}|[a-zA-Z]{2,4}).[a-zA-Z]{2,3}$/;
    if (!rep.test(email.val())) {
      email.focus();
      emailNote.text("邮箱格式不对！");
      return false;
    }

    emailNote.text("");
    if (password.val() != confirmPassword.val()) {
      password.focus();
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


  function updateUserModel() {
    var content = "<h1 class='text-center'>编辑用户</h1><form class='text-left'><div class='form-group'> <label for='updateName'>Your Name</label> <input type='text' class='form-control'"
      + "id='updateName' placeholder='name' required='required'><small id='nameNote2' class='form-text text-muted'></small></div><div class='form-group'> <label for='updateCompany'>Your"
      + " Company</label> <input type='text'class='form-control' id='updateCompany' placeholder='company'> </div><div class='form-group'> <label for='updateEmail'>Your email</label> "
      + "<input type='email'class='form-control' id='updateEmail' placeholder='name@example.com' required='required'><small id='emailNote2' class='form-text text-muted'></small>"
      + "</div><div class='form-row'><div class='form-group col-md-6'> <label for='updatePassword'>Password</label> <input type='password'class='form-control' id='updatePassword' "
      + "placeholder='password' required='required'><small id='passwordNote2' class='form-text text-muted'></small></div><div class='form-group col-md-6'> <label for='updateConf"
      + "irmPassword'>Confirm Password</label> <input type='password' class='form-control' id='updateConfirmPassword' placeholder='confirmPassword' required='required'></div></div></form>"
    return content;
  }

  function showResult(result) {
    // $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
    alert(result);
  }
