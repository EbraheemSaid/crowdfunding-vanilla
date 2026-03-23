const currentUser = getAuthUser();
if (!currentUser) {
  alert("You must be logged in to create a campaign.");
  window.location.href = "login.html";
}

document
  .getElementById("campaignForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const goal = document.getElementById("goal").value;
    const deadline = document.getElementById("deadline").value;
    const imageInput = document.getElementById("image");

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onloadend = async function () {
      const base64Image = reader.result;

      const newCampaign = {
        title: title,
        description: description,
        goal: parseFloat(goal),
        deadline: deadline,
        image: base64Image,
        creatorId: currentUser.id,
        isApproved: false,
      };

      try {
        const response = await fetch(`${API_URL}/campaigns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCampaign),
        });

        if (response.ok) {
          alert("Campaign submitted successfully! Waiting for admin approval.");
          window.location.href = "user-dashboard.html";
        }
      } catch (error) {
        console.error("Error creating campaign:", error);
        alert("Failed to submit campaign. Is your JSON server running?");
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });
