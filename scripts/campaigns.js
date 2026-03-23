const container = document.getElementById("campaignsContainer");

async function fetchAndRenderCampaigns(searchQuery = "") {
  let url = `${API_URL}/campaigns?isApproved=true`;

  if (searchQuery !== "") {
    url += `&q=${searchQuery}`;
  }

  try {
    const response = await fetch(url);
    const campaigns = await response.json();

    container.innerHTML = "";

    if (campaigns.length === 0) {
      container.innerHTML = `<p>No campaigns found.</p>`;
      return;
    }

    campaigns.forEach((campaign) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <img src="${campaign.image || "https://via.placeholder.com/300x200?text=No+Image"}" alt="Campaign Image">
                <h3 style="margin-top: 10px;">${campaign.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.9em; margin-bottom: 10px;">
                    ${campaign.description.substring(0, 60)}...
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${formatCurrency(campaign.goal)}</strong>
                    <a href="campaign-details.html?id=${campaign.id}" class="btn" style="padding: 5px 10px; font-size: 0.8em;">View Details</a>
                </div>
            `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    container.innerHTML = `<p style="color: red;">Failed to load campaigns. Make sure JSON Server is running.</p>`;
  }
}

// document.getElementById("searchBtn").addEventListener("click", function () {
//   const searchTerm = document.getElementById("searchInput").value.trim();
//   fetchAndRenderCampaigns(searchTerm);
// });

fetchAndRenderCampaigns();
