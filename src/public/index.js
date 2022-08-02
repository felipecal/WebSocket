var homeForm = document.getElementById("homeForm");
var homeInput = document.getElementById("homeInput");
homeForm.addEventListener("submit", function (e) {
   e.preventDefault();
   if (homeInput.value) {
      localStorage.setItem("username", homeInput.value);
      redirect();
   }
});
function redirect() {
   window.location.href = "chat.html";
}
