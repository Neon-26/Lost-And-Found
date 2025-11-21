let currentButton = null;
let currentTable = "";
let currentFilterLost = "";
let currentFilterFound = "";
let visibleRowsLost = [];
let visibleRowsFound = [];

let currentFilterClaims = "";
let visibleRowsClaims = [];
let currentPageClaims = 1;
let rowsPerPageClaims = 4;

let isEditModeClaims = false;

let currentFilterMatches = "";
let visibleRowsMatches = [];
let currentPageMatches = 1;
let rowsPerPageMatches = 4;
let isEditModeMatches = false;

function searchStudent() {
    const input = document.getElementById("searchBarStudent");
    currentFilterStudent = input.value.toLowerCase().trim(); 
    currentPageStudent = 1; 
    updateRowsAndPaginationStudent();
}

function updateVisibleRowsStudent() {
    const allRows = Array.from(studentTableBody.rows);
    visibleRowsStudent.length = 0; 
    allRows.forEach(row => {
        const nameCell = row.getElementsByTagName("td")[1];
        if (nameCell) {
            const nameValue = nameCell.textContent || nameCell.innerText;
            if (nameValue.toLowerCase().indexOf(currentFilterStudent) > -1) {
                visibleRowsStudent.push(row);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchBarStudent").value = "";
    updateRowsAndPaginationStudent();
});

function searchItem(table) {
    const input = table === 'lost' ? document.getElementById("searchBarLost") : document.getElementById("searchBarFound");
    if (table === 'lost') {
        currentFilterLost = input.value.toLowerCase();
        updateVisibleRows('lost');
        updateRowsAndPagination('lost');
    } else {
        currentFilterFound = input.value.toLowerCase();
        updateVisibleRows('found');
        updateRowsAndPagination('found');
    }
}

function updateVisibleRows(table) {
    const rows = table === 'lost' ? Array.from(lostTableBody.getElementsByTagName("tr")) : Array.from(foundTableBody.getElementsByTagName("tr"));
    const filter = table === 'lost' ? currentFilterLost : currentFilterFound;
    const visibleRows = table === 'lost' ? visibleRowsLost : visibleRowsFound;
    visibleRows.length = 0;
    rows.forEach(row => {
        const itemCell = row.getElementsByTagName("td")[0];
        if (itemCell) {
            const textValue = itemCell.textContent || itemCell.innerText;
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                visibleRows.push(row);
            }
        }
    });
}

let lostTableBody = document.getElementById("lostTableBody");
let foundTableBody = document.getElementById("foundTableBody");

let currentPageLost = 1;
let currentPageFound = 1;
let rowsPerPage = 5;

function displayTable(table) {
    const visibleRows = table === 'lost' ? visibleRowsLost : visibleRowsFound;
    const currentPage = table === 'lost' ? currentPageLost : currentPageFound;
    const tableBody = table === 'lost' ? lostTableBody : foundTableBody;

    Array.from(tableBody.getElementsByTagName("tr")).forEach(row => row.style.display = "none");

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    visibleRows.slice(start, end).forEach(row => row.style.display = "");
    renderPagination(table);
}

function renderPagination(table) {
    const visibleRows = table === 'lost' ? visibleRowsLost : visibleRowsFound;
    const currentPage = table === 'lost' ? currentPageLost : currentPageFound;
    const pagination = table === 'lost' ? document.getElementById("paginationLost") : document.getElementById("paginationFound");
    let pageCount = Math.ceil(visibleRows.length / rowsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = function() {
            if (table === 'lost') {
                currentPageLost = i;
            } else {
                currentPageFound = i;
            }
            displayTable(table);
        };
        if (i === currentPage) btn.style.background = "#4CAF50";
        pagination.appendChild(btn);
    }
}

function updateRowsAndPagination(table) {
    updateVisibleRows(table);
    const visibleRows = table === 'lost' ? visibleRowsLost : visibleRowsFound;
    const currentPage = table === 'lost' ? currentPageLost : currentPageFound;
    let pageCount = Math.ceil(visibleRows.length / rowsPerPage);
    if (currentPage > pageCount && pageCount > 0) {
        if (table === 'lost') {
            currentPageLost = pageCount;
        } else {
            currentPageFound = pageCount;
        }
    } else if (pageCount === 0) {
        if (table === 'lost') {
            currentPageLost = 1;
        } else {
            currentPageFound = 1;
        }
    }
    displayTable(table);
    updateDashboard(); 
}

function showPopup(message, yesAction, noAction, table) {
    const overlay = table === 'lost' ? document.getElementById("popupOverlayLost") : table === 'found' ? document.getElementById("popupOverlayFound") : table === 'claims' ? document.getElementById("popupOverlayClaims") : document.getElementById("popupOverlayMatches");
    const msg = table === 'lost' ? document.getElementById("popupMessageLost") : table === 'found' ? document.getElementById("popupMessageFound") : table === 'claims' ? document.getElementById("popupMessageClaims") : document.getElementById("popupMessageMatches");
    const btns = table === 'lost' ? document.getElementById("popupButtonsLost") : table === 'found' ? document.getElementById("popupButtonsFound") : table === 'claims' ? document.getElementById("popupButtonsClaims") : document.getElementById("popupButtonsMatches");

    msg.textContent = message;
    btns.innerHTML = "";

    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Yes";
    yesBtn.className = "yes";
    yesBtn.onclick = () => { overlay.style.display = "none"; yesAction(); };

    const noBtn = document.createElement("button");
    noBtn.textContent = "No";
    noBtn.className = "no";
    noBtn.onclick = () => { overlay.style.display = "none"; noAction(); };

    btns.appendChild(yesBtn);
    btns.appendChild(noBtn);

    overlay.style.display = "flex";
}

function startValidation(button, table) {
    currentButton = button;
    currentTable = table;
    const reportType = table === 'lost' ? 'Lost' : 'Found';
    showPopup(`Is the ${reportType} Report Valid?`, () => approveReport(), () => askRemove(), table);
}

function approveReport() {
    const row = currentButton.closest("tr");
    const actionCell = row.querySelector("td:last-child");
    actionCell.innerHTML = "<button class='Valid-btn'>Approved</button>";
    
    const reportType = currentTable === 'lost' ? 'Lost' : 'Found';
    updateRowsAndPagination(currentTable);
    alertBox(`${reportType} Report Approved.`, currentTable);
}

function askRemove() {
    const tableType = currentTable === 'lost' ? 'lost items' : 'found items';
    showPopup(`Do you want to remove this from the ${tableType} table?`, 
        () => removeItem(), 
        () => addRemoveButton(), currentTable);
}

function removeItem() {
    const row = currentButton.closest("tr");
    row.remove();
    updateRowsAndPagination(currentTable);
    const tableType = currentTable === 'lost' ? 'lost items' : 'found items';
    alertBox(`Item removed from ${tableType} table.`, currentTable);
}

function addRemoveButton() {
    const td = currentButton.parentElement;
    if (!td.querySelector(".remove-btn")) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function() {
            const row = this.closest("tr");
            row.remove();
            updateRowsAndPagination(currentTable);
            const tableType = currentTable === 'lost' ? 'lost items' : 'found items';
            alertBox(`Item removed from ${tableType} table.`, currentTable);
        };
        td.appendChild(removeBtn);
    }
    const tableType = currentTable === 'lost' ? 'lost items' : 'found items';
    alertBox(`Remove button added beside Valid in ${tableType} table.`, currentTable);
}

function alertBox(message, table) {
    const overlay = table === 'lost' ? document.getElementById("popupOverlayLost") : table === 'found' ? document.getElementById("popupOverlayFound") : table === 'claims' ? document.getElementById("popupOverlayClaims") : document.getElementById("popupOverlayMatches");
    const msg = table === 'lost' ? document.getElementById("popupMessageLost") : table === 'found' ? document.getElementById("popupMessageFound") : table === 'claims' ? document.getElementById("popupMessageClaims") : document.getElementById("popupMessageMatches");
    const btns = table === 'lost' ? document.getElementById("popupButtonsLost") : table === 'found' ? document.getElementById("popupButtonsFound") : table === 'claims' ? document.getElementById("popupButtonsClaims") : document.getElementById("popupButtonsMatches");

    msg.textContent = message;
    btns.innerHTML = "";

    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.className = "yes";
    okBtn.onclick = () => overlay.style.display = "none";

    btns.appendChild(okBtn);
    overlay.style.display = "flex";
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
    event.target.classList.add('active');

    if (pageId === 'listofl') {
        appendNewItemsToLostAdmin();
        attachViewButtonListeners();
        updateRowsAndPagination('lost');
    } else if (pageId === 'listoff') {
        appendNewItemsToFoundAdmin();
        attachViewButtonListeners();
        updateRowsAndPagination('found');
    } else if (pageId === 'claimrequests') {
        updateRowsAndPaginationClaims();
    } else if (pageId === 'matchrequests') {
        updateRowsAndPaginationMatches();
    }
}

function appendNewItemsToLostAdmin() {
    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    const tbody = document.getElementById("lostTableBody");
    const existingItemNames = Array.from(tbody.getElementsByTagName("tr")).map(row => row.cells[0].innerText.toLowerCase());
    
    lostItems.forEach(item => {
        if (!existingItemNames.includes(item.itemName.toLowerCase())) {
            const row = document.createElement("tr");
            const date = new Date(item.date);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            const imageCell = item.image ? `<button class="view-btn" data-image="${item.image}">View</button>` : '';
            
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${formattedDate}</td>
                <td>${imageCell}</td>
                <td><button class="Valid-btn" onclick="startValidation(this, 'lost')">Valid</button></td>
            `;
            tbody.appendChild(row);
        }
    });
}

function appendNewItemsToFoundAdmin() {
    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    const tbody = document.getElementById("foundTableBody");
    const existingItemNames = Array.from(tbody.getElementsByTagName("tr")).map(row => row.cells[0].innerText.toLowerCase());
    
    foundItems.forEach(item => {
        if (!existingItemNames.includes(item.itemName.toLowerCase())) {
            const row = document.createElement("tr");
            const date = new Date(item.date);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            const imageCell = item.image ? `<button class="view-btn" data-image="${item.image}">View</button>` : '';
            
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${formattedDate}</td>
                <td>${imageCell}</td>
                <td><button class="Valid-btn" onclick="startValidation(this, 'found')">Valid</button></td>
            `;
            tbody.appendChild(row);
        }
    });
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

document.addEventListener("DOMContentLoaded", function() {
    const imagePopup = document.getElementById("imagePopup");
    if (imagePopup) {
        imagePopup.style.display = "none";
    }
});


function updateVisibleRowsClaims() {
    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    visibleRowsClaims.length = 0;
    claimRequests.forEach(request => {
        visibleRowsClaims.push(request);
    });
}

function displayTableClaims() {
    const tbody = document.getElementById('claimRequestsBody');
    const noClaimsMsg = document.getElementById('noClaimsMessage');
    const removeColumnHeader = document.getElementById('removeColumnHeader');
    tbody.innerHTML = '';

    if (visibleRowsClaims.length === 0) {
        noClaimsMsg.style.display = 'block';
        removeColumnHeader.style.display = 'none';
        return;
    }
    noClaimsMsg.style.display = 'none';
    removeColumnHeader.style.display = isEditModeClaims ? '' : 'none';

    let start = (currentPageClaims - 1) * rowsPerPageClaims;
    let end = start + rowsPerPageClaims;
    visibleRowsClaims.slice(start, end).forEach((request, index) => {
        const row = document.createElement('tr');
        const removeCell = isEditModeClaims ? `<td><button class="Valid-btn" onclick="removeClaimRequest(${start + index})" style="background: red; color: white;">X</button></td>` : '';
        const imageCell = request.image ? `<button class="view-btn" data-image="${request.image}">View</button>` : '';
        row.innerHTML = `
            <td>${request.itemName}</td>
            <td>${request.description}</td>
            <td>${request.location}</td>
            <td>${request.date}</td>
            <td>${request.type}</td>
            <td>${request.user}</td>
            <td>${request.status || 'Pending'}</td>
            <td>${imageCell}</td>
            <td>
                <button class="Valid-btn" onclick="updateClaimStatus(${start + index}, 'Approved')">Approve</button>
                <button class="Valid-btn" onclick="updateClaimStatus(${start + index}, 'Rejected')">Reject</button>
            </td>
            ${removeCell}
        `;
        tbody.appendChild(row);
    });
    renderPaginationClaims();
    attachViewButtonListeners();
}

function renderPaginationClaims() {
    const pagination = document.getElementById("paginationClaims");
    if (!pagination) return;
    let pageCount = Math.ceil(visibleRowsClaims.length / rowsPerPageClaims);
    pagination.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = function() {
            currentPageClaims = i;
            displayTableClaims();
        };
        if (i === currentPageClaims) btn.style.background = "#4CAF50";
        pagination.appendChild(btn);
    }
}

function updateRowsAndPaginationClaims() {
    updateVisibleRowsClaims();
    let pageCount = Math.ceil(visibleRowsClaims.length / rowsPerPageClaims);
    if (currentPageClaims > pageCount && pageCount > 0) {
        currentPageClaims = pageCount;
    } else if (pageCount === 0) {
        currentPageClaims = 1;
    }
    displayTableClaims();
    updateDashboard(); 
}

function updateClaimStatus(index, status) {
    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    if (claimRequests[index]) {
        claimRequests[index].status = status;
        localStorage.setItem('claimRequests', JSON.stringify(claimRequests));
        updateRowsAndPaginationClaims();
        alertBox(`Claim request ${status.toLowerCase()}.`, 'claims');
    }
}

function toggleEditModeClaims() {
    isEditModeClaims = !isEditModeClaims;
    const editBtn = document.getElementById('editClaimsBtn');
    editBtn.textContent = isEditModeClaims ? 'Done' : 'Edit';
    updateRowsAndPaginationClaims();
}

function removeClaimRequest(index) {
    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    if (claimRequests[index]) {
        claimRequests.splice(index, 1);
        localStorage.setItem('claimRequests', JSON.stringify(claimRequests));
        updateRowsAndPaginationClaims();
        alertBox('Claim request removed.', 'claims');
    }
}

document.getElementById('editClaimsBtn').addEventListener('click', toggleEditModeClaims);

function updateVisibleRowsMatches() {
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    visibleRowsMatches.length = 0;
    matchRequests.forEach(request => {
        visibleRowsMatches.push(request);
    });
}

function displayTableMatches() {
    const tbody = document.getElementById('matchRequestsBody');
    const noMatchesMsg = document.getElementById('noMatchesMessage');
    const removeColumnHeader = document.getElementById('removeMatchColumnHeader');
    tbody.innerHTML = '';

    if (visibleRowsMatches.length === 0) {
        noMatchesMsg.style.display = 'block';
        removeColumnHeader.style.display = 'none';
        return;
    }
    noMatchesMsg.style.display = 'none';
    removeColumnHeader.style.display = isEditModeMatches ? '' : 'none';

    let start = (currentPageMatches - 1) * rowsPerPageMatches;
    let end = start + rowsPerPageMatches;
    visibleRowsMatches.slice(start, end).forEach((request, index) => {
        const row = document.createElement('tr');
        const removeCell = isEditModeMatches ? `<td><button class="Valid-btn" onclick="removeMatchRequest(${start + index})" style="background: red; color: white;">X</button></td>` : '';
        const imageCell = request.image ? `<button class="view-btn" data-image="${request.image}">View</button>` : ''; 
        row.innerHTML = `
            <td>${request.itemName}</td>
            <td>${request.description}</td>
            <td>${request.location}</td>
            <td>${request.date}</td>
            <td>${request.type}</td>
            <td>${request.user}</td>
            <td>${request.status || 'Pending'}</td>
            <td>${imageCell}</td>
            <td>
                <button class="Valid-btn" onclick="updateMatchStatus(${start + index}, 'Approved')">Approve</button>
                <button class="Valid-btn" onclick="updateMatchStatus(${start + index}, 'Rejected')">Reject</button>
            </td>
            ${removeCell}
        `;
        tbody.appendChild(row);
    });
    renderPaginationMatches();
    attachViewButtonListeners();  
}

function renderPaginationMatches() {
    const pagination = document.getElementById("paginationMatches");
    if (!pagination) return;
    let pageCount = Math.ceil(visibleRowsMatches.length / rowsPerPageMatches);
    pagination.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = function() {
            currentPageMatches = i;
            displayTableMatches();
        };
        if (i === currentPageMatches) btn.style.background = "#4CAF50";
        pagination.appendChild(btn);
    }
}

function updateRowsAndPaginationMatches() {
    updateVisibleRowsMatches();
    let pageCount = Math.ceil(visibleRowsMatches.length / rowsPerPageMatches);
    if (currentPageMatches > pageCount && pageCount > 0) {
        currentPageMatches = pageCount;
    } else if (pageCount === 0) {
        currentPageMatches = 1;
    }
    displayTableMatches();
    updateDashboard(); 
}

function updateMatchStatus(index, status) {
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    if (matchRequests[index]) {
        matchRequests[index].status = status;
        localStorage.setItem('matchRequests', JSON.stringify(matchRequests));
        updateRowsAndPaginationMatches();
        alertBox(`Match request ${status.toLowerCase()}.`, 'matches');
    }
}

function addEventListener() {
    const td = currentButton.parentElement;
    if (!td.querySelector(".remove-btn")) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = function() {
            const row = this.closest("tr");
            row.remove();
            updateRowsAndPagination(currentTable);
            const tableType = currentTable === 'lost' ? 'lost items' : 'found items';
            alertBox(`Item removed from ${tableType} table.`, currentTable);
        };
        td.appendChild(removeBtn);
    }
}

function toggleEditModeMatches() {
    isEditModeMatches = !isEditModeMatches;
    const editBtn = document.getElementById('editMatchesBtn');
    editBtn.textContent = isEditModeMatches ? 'Done' : 'Edit';
    updateRowsAndPaginationMatches();
}

function removeMatchRequest(index) {
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    if (matchRequests[index]) {
        matchRequests.splice(index, 1);
        localStorage.setItem('matchRequests', JSON.stringify(matchRequests));
        updateRowsAndPaginationMatches();
        alertBox('Match request removed.', 'matches');
    }
}

document.getElementById('editMatchesBtn').addEventListener('click', toggleEditModeMatches);

function updateDashboard() {

    const totalLost = document.getElementById("lostTableBody").getElementsByTagName("tr").length;
    document.getElementById("totalLost").textContent = totalLost;

    const totalFound = document.getElementById("foundTableBody").getElementsByTagName("tr").length;
    document.getElementById("totalFound").textContent = totalFound;

    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    document.getElementById("totalClaims").textContent = claimRequests.length;

    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    document.getElementById("totalMatches").textContent = matchRequests.length;

    const totalStudents = document.getElementById("studentTableBody").getElementsByTagName("tr").length;
    document.getElementById("totalStudents").textContent = totalStudents;
}

function updateUserMenu() {
    const username = sessionStorage.getItem('adminUsername');  

    const usernameSpan = document.getElementById('username');
    const dropdown = document.getElementById('userMenuDropdown');

    if (username) {
        usernameSpan.textContent = username;
    } else {
        usernameSpan.textContent = 'Login';
        window.location.href = '../index.html';
    }
}

document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('adminUsername');
    updateUserMenu();
});

document.getElementById('userMenuButton').addEventListener('click', () => {
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
        document.getElementById('userMenuDropdown').classList.toggle('show');
    } else {
    }
});

document.addEventListener('click', (event) => {
    const button = document.getElementById('userMenuButton');
    const dropdown = document.getElementById('userMenuDropdown');
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

updateUserMenu();

let studentTableBody = document.getElementById("studentTableBody");
let currentFilterStudent = "";
let visibleRowsStudent = [];
let currentPageStudent = 1;
let rowsPerPageStudent = 10;

function renderPaginationStudent() {
    const pagination = document.getElementById("paginationStudent");
    if (!pagination) return;
    let pageCount = Math.ceil(visibleRowsStudent.length / rowsPerPageStudent);
    pagination.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        btn.onclick = function() {
            currentPageStudent = i;
            displayTableStudent();
        };
        if (i === currentPageStudent) btn.style.background = "#4CAF50";
        pagination.appendChild(btn);
    }
}

function updateVisibleRowsStudent() {
    visibleRowsStudent = Array.from(studentTableBody.rows);

}

function displayTableStudent() {

    visibleRowsStudent.forEach(row => row.style.display = "none");

    let start = (currentPageStudent - 1) * rowsPerPageStudent;
    let end = start + rowsPerPageStudent;

    for (let i = start; i < end && i < visibleRowsStudent.length; i++) {
        visibleRowsStudent[i].style.display = "";
    }

    renderPaginationStudent();
}

function updateRowsAndPaginationStudent() {
    updateVisibleRowsStudent();
    let pageCount = Math.ceil(visibleRowsStudent.length / rowsPerPageStudent);
    if (currentPageStudent > pageCount && pageCount > 0) {
        currentPageStudent = pageCount;
    } else if (pageCount === 0) {
        currentPageStudent = 1;
    }
    displayTableStudent();
    updateDashboard();
}

document.addEventListener("DOMContentLoaded", function() {
    updateRowsAndPaginationStudent();
});

updateRowsAndPagination('lost');
updateRowsAndPagination('found');
updateRowsAndPaginationClaims();
updateRowsAndPaginationMatches();
updateDashboard();