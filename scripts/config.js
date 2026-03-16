const API_URL = "http://localhost:3000";

function getAuthUser() {
  return JSON.parse(localStorage.getItem("authUser"));
}

function setAuthUser(user) {
  localStorage.setItem("authUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("authUser");
  window.location.href = "login.html";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
