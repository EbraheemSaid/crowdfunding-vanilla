const currentUser = getAuthUser();
if (!currentUser || currentUser.role !== "admin") {
  alert("Unauthorized access. Admins only.");
  window.location.href = "login.html";
}

const tableBody = document.getElementById("usersTableBody");

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();

    tableBody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");

      const statusText = user.isActive
        ? "<span style='color: green;'>Active</span>"
        : "<span style='color: red;'>Banned</span>";
      const actionButton = user.isActive
        ? `<button class="btn ban-btn" data-id="${user.id}" style="background: var(--danger-color); padding: 5px 10px; font-size: 0.8em;">Ban User</button>`
        : `<button class="btn" disabled style="background: #ccc; padding: 5px 10px; font-size: 0.8em; cursor: not-allowed;">Banned</button>`;

      tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${statusText}</td>
                <td>${user.role === "admin" ? "<i>Admin</i>" : actionButton}</td>
            `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    tableBody.innerHTML =
      "<tr><td colspan='6' style='color: red;'>Failed to load users.</td></tr>";
  }
}

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("ban-btn")) {
    const userId = event.target.getAttribute("data-id");

    if (
      !confirm(
        "Are you sure you want to ban this user? They will no longer be able to log in.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (response.ok) {
        alert("User has been banned.");
        loadUsers();
      }
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Failed to ban user.");
    }
  }
});

loadUsers();
