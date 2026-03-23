const urlParams = new URLSearchParams(window.location.search);
const campaignId = urlParams.get("id");

const currentUser = getAuthUser();

const detailsContainer = document.getElementById("campaignDetailsContainer");
const pledgeSection = document.getElementById("pledgeSection");
const pledgeForm = document.getElementById("pledgeForm");
const authMessage = document.getElementById("authMessage");

async function loadCampaignDetails() {
  if (!campaignId) {
    detailsContainer.innerHTML =
      "<p style='color: red;'>No campaign ID provided.</p>";
    return;
  }

  try {
    const campaignRes = await fetch(`${API_URL}/campaigns/${campaignId}`);
    if (!campaignRes.ok) throw new Error("Campaign not found");
    const campaign = await campaignRes.json();

    const pledgesRes = await fetch(
      `${API_URL}/pledges?campaignId=${campaignId}`,
    );
    const pledges = await pledgesRes.json();

    const totalRaised = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);

    detailsContainer.innerHTML = `
            <img src="${campaign.image || "https://via.placeholder.com/800x400?text=No+Image"}" style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--radius);">
            <h2 style="margin-top: 20px;">${campaign.title}</h2>
            <div style="display: flex; gap: 20px; margin: 15px 0; color: var(--text-muted);">
                <span><strong>Goal:</strong> ${formatCurrency(campaign.goal)}</span>
                <span><strong>Raised:</strong> ${formatCurrency(totalRaised)}</span>
                <span><strong>Deadline:</strong> ${campaign.deadline}</span>
            </div>
            <p style="font-size: 1.1em; line-height: 1.8;">${campaign.description}</p>
        `;

    pledgeSection.style.display = "block";
    if (!currentUser) {
      pledgeForm.style.display = "none";
      authMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading details:", error);
    detailsContainer.innerHTML =
      "<p style='color: red;'>Failed to load campaign details.</p>";
  }
}

pledgeForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("pledgeAmount").value);

  const isConfirmed = confirm(
    `Mock Payment: Do you confirm your pledge of ${formatCurrency(amount)} to this campaign?`,
  );

  if (!isConfirmed) {
    return;
  }

  const newPledge = {
    campaignId: campaignId,
    userId: currentUser.id,
    amount: amount,
  };

  try {
    const response = await fetch(`${API_URL}/pledges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPledge),
    });

    if (response.ok) {
      alert("Payment successful! Thank you for your pledge.");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error submitting pledge:", error);
    alert("Pledge failed. Check your JSON server.");
  }
});

loadCampaignDetails();
