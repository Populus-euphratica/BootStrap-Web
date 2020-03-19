var stateData=JSON.parse(sessionStorage.getItem("stateData"));
$(document).ready(init());
function init(){
  
  var login=sessionStorage.getItem("login");
  if(login!="true"||typeof(stateData) == "undefined"||$.isEmptyObject(stateData)){
    window.location.href="Login.html";
  }
  
  $("#state").html("<i class='fa fa-user-circle-o' aria-hidden='true'></i>"+stateData.name);
  
  
}

