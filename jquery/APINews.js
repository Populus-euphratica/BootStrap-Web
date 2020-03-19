

        // 定义全局变量方便下面进行页面刷新和实现页面跳转
        var pageNum = 1;
        var searchUrl = "";
        var searchType = "";
        var searchValue = "";
        var data1 = {};


        var stateData = JSON.parse(sessionStorage.getItem("stateData"));
        $(document).ready(init());
        function init() {

            var login = sessionStorage.getItem("login");
            if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData)) {
                window.location.href = "Login.html";
            }

            $("#state").html("<i class='fa fa-user-circle-o' aria-hidden='true'></i>" + stateData.name);


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
                } else if (searchValue == "data") {
                    searchUrl = "http://localhost:8080/api/apiNews/data";
                    searchType = "get";
                    data1 = {
                        "data": searchContent,
                        "pageNum": pageNum
                    };
                    ajaxAPI(data1);
                } else if (searchValue == "dateSection") {
                    searchUrl = "http://localhost:8080/api/apiNews/dateSection";
                    searchType = "get";
                    data1 = {
                        "dateSection": searchContent,
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
        $(document).ready(function () {
            $("#search").click();
        });

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



        function showResult(result) {
            $('<div>').appendTo('body').addClass('alert alert-success').html('操作成功').show().delay(1500).fadeOut();
        }
