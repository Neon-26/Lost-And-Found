let currentFilter = "";
let rows = [];
let visibleRows = [];
let currentPage = 1;
const rowsPerPage = 5;

let selectedItem = {};
let currentRow = null;

document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.getElementById("inventoryTableBody");
    rows = Array.from(tbody.getElementsByTagName("tr"));
    visibleRows = [...rows];

    appendNewItemsFromStorage();
    
    updateRowsAndPagination();
    createPaginationControls();
    
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("keyup", searchItem);
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetLocalStorage);
    }
});

function appendNewItemsFromStorage() {
    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    const tbody = document.getElementById("inventoryTableBody");

    const existingItemNames = Array.from(tbody.getElementsByTagName("tr")).map(row => row.cells[0].innerText.toLowerCase());
    
    foundItems.forEach(item => {
        if (!existingItemNames.includes(item.itemName.toLowerCase())) {
            const row = document.createElement("tr");
            row.setAttribute("data-status", item.status);

            const date = new Date(item.dateAdded);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

            const imageCell = item.image ? `<button class="view-btn" data-image="${item.image}">View</button>` : '';
            
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${formattedDate}</td>
                <td>${item.status}</td>
                <td>${imageCell}</td>
                <td><button class="Match-btn" title="Claim?">Claim</button>
            `;
            tbody.appendChild(row);
            rows.push(row);
        }
    });
    
    visibleRows = [...rows];
    attachMatchButtonListeners();
    attachViewButtonListeners(); 
}

function attachViewButtonListeners() {
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const imageSrc = this.getAttribute("data-image");
            document.getElementById("popupImage").src = imageSrc;
            document.getElementById("imagePopup").style.display = "flex";
        });
    });
}

function closeImagePopup() {
    document.getElementById("imagePopup").style.display = "none";
}

function attachMatchButtonListeners() {
    document.querySelectorAll(".Match-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            currentRow = this.closest("tr");
            selectedItem = {
                row: currentRow,  
                name: currentRow.cells[0].innerText,
                description: currentRow.cells[1].innerText,
                location: currentRow.cells[2].innerText,
                dateAdded: currentRow.cells[3].innerText,
                status: currentRow.getAttribute("data-status")
            };
            document.getElementById("confirmPopup").style.display = "flex";
        });
    });
}

function resetLocalStorage() {
    localStorage.removeItem('foundItems');
    localStorage.removeItem('matchRequests');
    localStorage.removeItem('claimRequests');
    location.reload();
}

document.getElementById("yesBtn").addEventListener("click", function() {
    document.getElementById("confirmPopup").style.display = "none";
    updateStatus("Matched");

    const matchRequest = {
        itemName: selectedItem.name,
        description: selectedItem.description,
        location: selectedItem.location,
        date: selectedItem.dateAdded,
        type: 'found',
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
    updateStatus("Not Matched");
    document.getElementById("statusText").innerText = "Match Status: Not Matched";
    document.getElementById("statusPopup").style.display = "flex";
});

document.getElementById("viewStatusBtn").addEventListener("click", function() {
    document.getElementById("markedPopup").style.display = "none";
    const currentStatus = selectedItem.row.getAttribute("data-status");
    document.getElementById("statusText").innerText = "Match Status: " + currentStatus;
    document.getElementById("statusPopup").style.display = "flex";
});

document.getElementById("claimBtn").addEventListener("click", function() {
    document.getElementById("markedPopup").style.display = "none";
    const cells = currentRow.querySelectorAll('td');
    const claimRequest = {
        itemName: cells[0].textContent,
        description: cells[1].textContent,
        location: cells[2].textContent,
        date: cells[3].textContent,
        type: 'found',
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
    updateStatus("Claim Request"); 
}

function closeStatus() {
    document.getElementById("statusPopup").style.display = "none";
}

function updateStatus(newStatus) {
    selectedItem.row.setAttribute("data-status", newStatus);
    selectedItem.row.cells[4].innerText = newStatus;

    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    const index = Array.from(selectedItem.row.parentNode.children).indexOf(selectedItem.row) - 11;  
    if (index >= 0 && foundItems[index]) {
        foundItems[index].status = newStatus;
        localStorage.setItem('foundItems', JSON.stringify(foundItems));
    }
}

function searchItem() {
    const input = document.getElementById("searchBar");
    currentFilter = input.value.toLowerCase();
    currentPage = 1;
    updateVisibleRows();
    updateRowsAndPagination();
    createPaginationControls();
}

function updateVisibleRows() {
    visibleRows = rows.filter(row => {
        const itemCell = row.getElementsByTagName("td")[0];
        if (itemCell) {
            const textValue = itemCell.textContent || itemCell.innerText;
            return textValue.toLowerCase().indexOf(currentFilter) > -1;
        }
        return false;
    });
}

function updateRowsAndPagination() {
    displayRows();
}

function displayRows() {
    const tbody = document.getElementById("inventoryTableBody");

    rows.forEach(row => row.style.display = "none");
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rowsToShow = visibleRows.slice(start, end);
    rowsToShow.forEach(row => row.style.display = "");
}

function createPaginationControls() {
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

    const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = prevPage;
    paginationDiv.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? "active" : "";
        pageBtn.onclick = () => goToPage(i);
        paginationDiv.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = nextPage;
    paginationDiv.appendChild(nextBtn);
}

function goToPage(page) {
    currentPage = page;
    updateRowsAndPagination();
    createPaginationControls();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateRowsAndPagination();
        createPaginationControls();
    }
}

function nextPage() {
    const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateRowsAndPagination();
        createPaginationControls();
    }
}
