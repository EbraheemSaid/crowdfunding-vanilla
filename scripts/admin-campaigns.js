const currentUser = getAuthUser();
if (!currentUser || currentUser.role !== "admin") {
  alert("Unauthorized access. Admins only.");
  window.location.href = "login.html";
}

const tableBody = document.getElementById("campaignsTableBody");

async function loadCampaigns() {
  try {
    const response = await fetch(`${API_URL}/campaigns`);
    const campaigns = await response.json();

    tableBody.innerHTML = "";

    if (campaigns.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='6'>No campaigns found on the platform.</td></tr>";
      return;
    }

    campaigns.forEach((camp) => {
      const tr = document.createElement("tr");

      const statusText = camp.isApproved
        ? "<span style='color: green; font-weight: bold;'>Approved</span>"
        : "<span style='color: orange; font-weight: bold;'>Pending/Rejected</span>";

      const toggleApprovalBtn = camp.isApproved
        ? `<button class="btn reject-btn" data-id="${camp.id}" style="background: #f39c12; padding: 5px 10px; font-size: 0.8em;">Reject</button>`
        : `<button class="btn approve-btn" data-id="${camp.id}" style="background: var(--primary-color); padding: 5px 10px; font-size: 0.8em;">Approve</button>`;

      tr.innerHTML = `
                <td>${camp.id}</td>
                <td>${camp.title}</td>
                <td>${camp.creatorId}</td>
                <td>${formatCurrency(camp.goal)}</td>
                <td>${statusText}</td>
                <td class="action-buttons">
                    ${toggleApprovalBtn}
                    <button class="btn delete-btn" data-id="${camp.id}" style="background: var(--danger-color); padding: 5px 10px; font-size: 0.8em;">Delete</button>
                </td>
            `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    tableBody.innerHTML =
      "<tr><td colspan='6' style='color: red;'>Failed to load campaigns.</td></tr>";
  }
}

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("approve-btn")) {
    const id = event.target.getAttribute("data-id");
    if (confirm("Approve this campaign to be visible to guests?")) {
      await updateCampaignStatus(id, true);
    }
  }

  if (event.target.classList.contains("reject-btn")) {
    const id = event.target.getAttribute("data-id");
    if (confirm("Reject this campaign? It will be hidden from guests.")) {
      await updateCampaignStatus(id, false);
    }
  }

  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.getAttribute("data-id");
    if (
      confirm(
        "WARNING: Are you sure you want to completely delete this campaign? This cannot be undone.",
      )
    ) {
      await deleteCampaign(id);
    }
  }
});

async function updateCampaignStatus(id, isApprovedStatus) {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: isApprovedStatus }),
    });

    if (response.ok) {
      loadCampaigns();
    }
  } catch (error) {
    console.error("Error updating campaign status:", error);
    alert("Failed to update status.");
  }
}

async function deleteCampaign(id) {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadCampaigns();
    }
  } catch (error) {
    console.error("Error deleting campaign:", error);
    alert("Failed to delete campaign.");
  }
}

loadCampaigns();
