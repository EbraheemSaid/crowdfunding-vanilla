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

function renderNavbar() {
  const user = getAuthUser();
  let navLinks = "";

  if (!user) {
    navLinks = `
            <a href="campaigns.html">Browse Campaigns</a>
            <a href="login.html" style="margin-left: 10px;">Login</a>
            <a href="register.html" class="btn" style="padding: 8px 15px;">Sign Up</a>
        `;
  } else if (user.role === "admin") {
    navLinks = `
            <a href="campaigns.html">Browse</a>
            <a href="admin-dashboard.html">Admin Hub</a>
            <a href="admin-user.html">Manage Users</a>
            <a href="admin-campaigns.html">Manage Campaigns</a>
            <span style="border-left: 1px solid #ccc; padding-left: 20px; font-weight: bold; color: var(--primary-color);">Admin: ${user.name}</span>
            <button onclick="logoutUser()" class="btn" style="background: var(--danger-color); padding: 8px 15px;">Logout</button>
        `;
  } else {
    navLinks = `
            <a href="campaigns.html">Browse</a>
            <a href="user-dashboard.html">My Dashboard</a>
            <a href="create-campaign.html" style="color: var(--primary-color); font-weight: bold;">+ Launch Campaign</a>
            <span style="border-left: 1px solid #ccc; padding-left: 20px; font-weight: bold;">Hi, ${user.name}</span>
            <button onclick="logoutUser()" class="btn" style="background: var(--danger-color); padding: 8px 15px;">Logout</button>
        `;
  }

  const navHTML = `
        <nav class="main-navbar">
            <div>
                <a href="campaigns.html" style="font-size: 1.5em; font-weight: 800; color: var(--primary-color);">CrowdFund</a>
            </div>
            <div class="nav-links">
                ${navLinks}
            </div>
        </nav>
    `;

  document.body.insertAdjacentHTML("afterbegin", navHTML);
}

document.addEventListener("DOMContentLoaded", renderNavbar);
