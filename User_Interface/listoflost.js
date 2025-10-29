let currentFilterLost = "";
let rowsLost = [];
let visibleRowsLost = [];
let currentPageLost = 1;
const rowsPerPageLost = 5;

let selectedItemLost = {};
let currentRowLost = null;

document.addEventListener("DOMContentLoaded", function() {

    const tbody = document.getElementById("inventoryTableBody");
    rowsLost = Array.from(tbody.getElementsByTagName("tr"));
    visibleRowsLost = [...rowsLost];

    appendNewItemsFromStorageLost();
    
    updateRowsAndPaginationLost();
    createPaginationControlsLost();
    
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("keyup", searchItemLost);
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", clearLocalStorageLost);
    }
});

function appendNewItemsFromStorageLost() {
    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    const tbody = document.getElementById("inventoryTableBody");

    const existingItemNames = Array.from(tbody.getElementsByTagName("tr")).map(row => row.cells[0].innerText.toLowerCase());
    
    lostItems.forEach(item => {
        if (!existingItemNames.includes(item.itemName.toLowerCase())) {
            const row = document.createElement("tr");
            row.setAttribute("data-status", item.status);

            const date = new Date(item.dateAdded);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${formattedDate}</td>
                <td>${item.status}</td>
                <td><button class="Match-btn" title="Match?">Match</button></td>
            `;
            tbody.appendChild(row);
            rowsLost.push(row);
        }
    });
    
    visibleRowsLost = [...rowsLost];

    attachMatchButtonListenersLost();
}

function attachMatchButtonListenersLost() {
    document.querySelectorAll(".Match-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            currentRowLost = this.closest("tr");
            selectedItemLost = {
                row: currentRowLost,  
                name: currentRowLost.cells[0].innerText,
                description: currentRowLost.cells[1].innerText,
                location: currentRowLost.cells[2].innerText,
                dateAdded: currentRowLost.cells[3].innerText,
                status: currentRowLost.getAttribute("data-status")
            };
            document.getElementById("confirmPopup").style.display = "flex";
        });
    });
}

function clearLocalStorageLost() {
    
    localStorage.removeItem('lostItems');
    localStorage.removeItem('matchRequests');
    localStorage.removeItem('claimRequests');
  
    location.reload();
}

document.getElementById("yesBtn").addEventListener("click", function() {
    document.getElementById("confirmPopup").style.display = "none";
    updateStatusLost("Matched");

    const matchRequest = {
        itemName: selectedItemLost.name,
        description: selectedItemLost.description,
        location: selectedItemLost.location,
        date: selectedItemLost.dateAdded,
        type: 'lost',
        user: 'Anonymous',
        status: 'Matched'
    };
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    matchRequests.push(matchRequest);
    localStorage.setItem('matchRequests', JSON.stringify(matchRequests));
    document.getElementById("markedPopup").style.display = "flex";
});

document.getElementById("noBtn").addEventListener("click", function() {
    document.getElementById("confirmPopup").style.display = "none";
    updateStatusLost("Not Matched");
    document.getElementById("statusText").innerText = "Match Status: Not Matched";
    document.getElementById("statusPopup").style.display = "flex";
});

document.getElementById("viewStatusBtn").addEventListener("click", function() {
    document.getElementById("markedPopup").style.display = "none";
    const currentStatus = selectedItemLost.row.getAttribute("data-status");
    document.getElementById("statusText").innerText = "Match Status: " + currentStatus;
    document.getElementById("statusPopup").style.display = "flex";
});

document.getElementById("claimBtn").addEventListener("click", function() {
    document.getElementById("markedPopup").style.display = "none";
    const cells = currentRowLost.querySelectorAll('td');
    const claimRequest = {
        itemName: cells[0].textContent,
        description: cells[1].textContent,
        location: cells[2].textContent,
        date: cells[3].textContent,
        type: 'lost',
        user: 'Anonymous',
        status: 'Pending'
    };

    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    claimRequests.push(claimRequest);
    localStorage.setItem('claimRequests', JSON.stringify(claimRequests));

    document.getElementById("claimPopup").style.display = "flex";
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
    updateStatusLost("Claim Request"); 
}

function closeStatus() {
    document.getElementById("statusPopup").style.display = "none";
}

function updateStatusLost(newStatus) {
    selectedItemLost.row.setAttribute("data-status", newStatus);
    selectedItemLost.row.cells[4].innerText = newStatus;

    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    const index = Array.from(selectedItemLost.row.parentNode.children).indexOf(selectedItemLost.row) - 11;  
    if (index >= 0 && lostItems[index]) {
        lostItems[index].status = newStatus;
        localStorage.setItem('lostItems', JSON.stringify(lostItems));
    }
}

function searchItemLost() {
    const input = document.getElementById("searchBar");
    currentFilterLost = input.value.toLowerCase();
    currentPageLost = 1;
    updateVisibleRowsLost();
    updateRowsAndPaginationLost();
    createPaginationControlsLost();
}

function updateVisibleRowsLost() {
    visibleRowsLost = rowsLost.filter(row => {
        const itemCell = row.getElementsByTagName("td")[0];
        if (itemCell) {
            const textValue = itemCell.textContent || itemCell.innerText;
            return textValue.toLowerCase().indexOf(currentFilterLost) > -1;
        }
        return false;
    });
}

function updateRowsAndPaginationLost() {
    displayRowsLost();
}

function displayRowsLost() {
    const tbody = document.getElementById("inventoryTableBody");

    rowsLost.forEach(row => row.style.display = "none");
    
    const start = (currentPageLost - 1) * rowsPerPageLost;
    const end = start + rowsPerPageLost;
    const rowsToShow = visibleRowsLost.slice(start, end);
    rowsToShow.forEach(row => row.style.display = "");
}

function createPaginationControlsLost() {
    const container = document.querySelector(".container");
    let paginationDiv = document.getElementById("paginationControls");
    if (!paginationDiv) {
        paginationDiv = document.createElement("div");
        paginationDiv.id = "paginationControls";
        paginationDiv.style.textAlign = "center";
        paginationDiv.style.marginTop = "20px";
        container.appendChild(paginationDiv);
    }
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(visibleRowsLost.length / rowsPerPageLost);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPageLost === 1;
    prevBtn.onclick = prevPageLost;
    paginationDiv.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = i === currentPageLost ? "active" : "";
        pageBtn.onclick = () => goToPageLost(i);
        paginationDiv.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPageLost === totalPages;
    nextBtn.onclick = nextPageLost;
    paginationDiv.appendChild(nextBtn);
}

function goToPageLost(page) {
    currentPageLost = page;
    updateRowsAndPaginationLost();
    createPaginationControlsLost();
}

function prevPageLost() {
    if (currentPageLost > 1) {
        currentPageLost--;
        updateRowsAndPaginationLost();
        createPaginationControlsLost();
    }
}

function nextPageLost() {
    const totalPages = Math.ceil(visibleRowsLost.length / rowsPerPageLost);
    if (currentPageLost < totalPages) {
        currentPageLost++;
        updateRowsAndPaginationLost();
        createPaginationControlsLost();
    }
}