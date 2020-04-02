var stateData=JSON.parse(sessionStorage.getItem("stateData"));
$(document).ready(init());

function init() {
  var state = sessionStorage.getItem("state");
  var login = sessionStorage.getItem("login");
  if (login != "true" || typeof (stateData) == "undefined" || $.isEmptyObject(stateData) || state != "user") {
    window.location.href = "Login.html";
  }

  $("#state").html("<i class='fa fa-user-circle-o d-inline fa-lg' aria-hidden='true'></i>" + stateData.name);


}