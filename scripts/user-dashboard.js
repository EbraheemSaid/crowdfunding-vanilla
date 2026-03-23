const currentUser = getAuthUser();
if (!currentUser) {
  window.location.href = "login.html";
}

const campaignsContainer = document.getElementById("myCampaignsContainer");
const pledgesContainer = document.getElementById("myPledgesContainer");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

async function loadDashboardData() {
  try {
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

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    document.getElementById("editCampaignId").value =
      event.target.getAttribute("data-id");
    document.getElementById("editDeadline").value =
      event.target.getAttribute("data-deadline");
    document.getElementById("editDescription").value =
      event.target.getAttribute("data-desc");

    editModal.style.display = "block";
  }
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  editModal.style.display = "none";
});

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("editCampaignId").value;

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
      loadDashboardData();
    }
  } catch (error) {
    console.error("Error updating campaign:", error);
    alert("Failed to update campaign details.");
  }
});

loadDashboardData();
