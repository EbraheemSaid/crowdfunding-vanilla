// user-dashboard.js

// 1. Route Protection
const currentUser = getAuthUser();
if (!currentUser) {
  window.location.href = "login.html";
}

// Set up header
document.getElementById("welcomeMessage").textContent =
  `Welcome, ${currentUser.name}`;
document.getElementById("logoutBtn").addEventListener("click", logoutUser); // Uses config.js helper

// DOM Elements
const campaignsContainer = document.getElementById("myCampaignsContainer");
const pledgesContainer = document.getElementById("myPledgesContainer");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

// 2. Fetch and Render Dashboard Data
async function loadDashboardData() {
  try {
    // Fetch User's Campaigns
    const campRes = await fetch(
      `${API_URL}/campaigns?creatorId=${currentUser.id}`,
    );
    const campaigns = await campRes.json();

    campaignsContainer.innerHTML = "";
    if (campaigns.length === 0) {
      campaignsContainer.innerHTML =
        "<p>You haven't created any campaigns yet.</p>";
    } else {
      campaigns.forEach((camp) => {
        const div = document.createElement("div");
        div.style.border = "1px solid var(--border-color)";
        div.style.padding = "15px";
        div.style.borderRadius = "var(--radius)";
        div.innerHTML = `
                    <h4 style="margin-bottom: 5px;">${camp.title}</h4>
                    <p style="font-size: 0.9em; color: var(--text-muted);">Deadline: ${camp.deadline}</p>
                    <p style="font-size: 0.9em; font-weight: bold; color: ${camp.isApproved ? "var(--primary-color)" : "orange"};">
                        Status: ${camp.isApproved ? "Approved" : "Pending Admin Approval"}
                    </p>
                    <button class="btn edit-btn" data-id="${camp.id}" data-deadline="${camp.deadline}" data-desc="${camp.description}" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8em;">Edit Details</button>
                `;
        campaignsContainer.appendChild(div);
      });
    }

    // Fetch User's Pledges using their ID
    const pledgeRes = await fetch(
      `${API_URL}/pledges?userId=${currentUser.id}`,
    );
    const pledges = await pledgeRes.json();

    pledgesContainer.innerHTML = "";
    if (pledges.length === 0) {
      pledgesContainer.innerHTML = "<p>You haven't made any pledges yet.</p>";
    } else {
      pledges.forEach((pledge) => {
        const div = document.createElement("div");
        div.style.border = "1px solid var(--border-color)";
        div.style.padding = "15px";
        div.style.borderRadius = "var(--radius)";
        div.innerHTML = `
                    <h4>Pledged: ${formatCurrency(pledge.amount)}</h4>
                    <p style="font-size: 0.9em; color: var(--text-muted);">To Campaign ID: ${pledge.campaignId}</p>
                `;
        pledgesContainer.appendChild(div);
      });
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    campaignsContainer.innerHTML =
      "<p style='color: red;'>Error loading dashboard data.</p>";
  }
}

// 3. Edit Modal Logic (Event Delegation)
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    // Populate the modal inputs with the existing data
    document.getElementById("editCampaignId").value =
      event.target.getAttribute("data-id");
    document.getElementById("editDeadline").value =
      event.target.getAttribute("data-deadline");
    document.getElementById("editDescription").value =
      event.target.getAttribute("data-desc");

    // Show the modal
    editModal.style.display = "block";
  }
});

// Close Modal
document.getElementById("closeModalBtn").addEventListener("click", () => {
  editModal.style.display = "none";
});

// 4. Handle Edit Form Submit (PATCH request)
editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("editCampaignId").value;

  // We only send the fields we want to update
  const updatedData = {
    deadline: document.getElementById("editDeadline").value,
    description: document.getElementById("editDescription").value,
  };

  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      alert("Campaign updated successfully!");
      editModal.style.display = "none";
      loadDashboardData(); // Refresh the list without reloading the whole page
    }
  } catch (error) {
    console.error("Error updating campaign:", error);
    alert("Failed to update campaign details.");
  }
});

// Initialize
loadDashboardData();
