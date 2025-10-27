let selectedItem = {};

document.querySelectorAll(".Match-btn").forEach(btn => {
    btn.addEventListener("click", 
        function() {
            const row = this.closest("tr");
        selectedItem = {
            name: row.cells[0].innerText,
            dateAdded: row.cells[2].innerText,
            dateLost: row.cells[3].innerText
        };

document.getElementById("confirmPopup").style.display = "flex";
        });
    });

document.getElementById("yesBtn").addEventListener("click", 
function() {

document.getElementById("confirmPopup").style.display = "none";

    const info = `
    <p><strong>Item Name:</strong> ${selectedItem.name}</p>
    <p><strong>Date Added:</strong> ${selectedItem.dateAdded}</p>
    <p><strong>Date Lost:</strong> ${selectedItem.dateLost}</p>
    <button onclick="sendClaim()">Claim Request</button>
    <button onclick="closeInfo()">Close</button>
    `;

document.getElementById("itemInfo").innerHTML = info;

document.getElementById("infoPopup").style.display = "flex";
});

document.getElementById("noBtn").addEventListener("click", function() {

document.getElementById("confirmPopup").style.display = "none";
});

function closeInfo() {

document.getElementById("infoPopup").style.display = "none";
}

function sendClaim() {

document.getElementById("infoPopup").style.display = "none";

document.getElementById("claimPopup").style.display = "flex";
}

function closeClaim() {

document.getElementById("claimPopup").style.display = "none";
}