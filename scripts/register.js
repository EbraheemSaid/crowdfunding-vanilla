document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const checkUser = await fetch(`${API_URL}/users?email=${email}`);
      const user = await checkUser.json();

      if (user.length > 0) {
        alert("email is already registered, please login");
      } else {
        const newUser = {
          name,
          email,
          password,
          role: "user",
          isActive: true,
        };

        const postRequest = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (postRequest.ok) {
          alert("registration successful, please login");
          window.location.href = "login.html";
        }
      }
    } catch (error) {
      console.error("error during registration:", error);
      alert("registration failed. Please try again.");
    }
  });
