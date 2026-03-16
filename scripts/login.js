document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch(
        `${API_URL}/users?email=${email}&password=${password}`,
      );
      const users = await response.json();

      if (users.length === 1) {
        const user = users[0];

        if (user.isActive === false) {
          alert("this account is banned by admin.");
          return;
        }

        setAuthUser(user);

        if (user.role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "user-dashboard.html";
        }
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("something went wrong, please checking your credentials.");
    }
  });
