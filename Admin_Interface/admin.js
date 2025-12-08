function isLocalStorageSupported() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function clearLocalStorage() {
    localStorage.clear();
    alert('localStorage cleared. Try confirming a match again.');
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

function loadNotifications() {
    const username = sessionStorage.getItem('adminUsername');
    if (!username) return [];
    const key = `notifications_${username}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveNotifications(notifications) {
    const username = sessionStorage.getItem('adminUsername');
    if (!username) return;
    localStorage.setItem(`notifications_${username}`, JSON.stringify(notifications));
}

function addNotification(message, type = 'info', targetUsername = null) {
    const username = targetUsername || sessionStorage.getItem('adminUsername');
    if (!username) return;
    const key = `notifications_${username}`;
    const notifications = JSON.parse(localStorage.getItem(key)) || [];
    notifications.unshift({
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem(key, JSON.stringify(notifications));
    if (!targetUsername) updateNotificationUI();
}

function markAsRead(notificationId) {
    const notifications = loadNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        saveNotifications(notifications);
        updateNotificationUI();
    }
}

function clearAllNotifications() {
    saveNotifications([]);
    updateNotificationUI();
}

function updateNotificationUI() {
    const notifications = loadNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('adminNotificationBadge');
    const list = document.getElementById('adminNotificationList');

    if (badge) badge.textContent = unreadCount;
    if (badge) badge.style.display = unreadCount > 0 ? 'inline' : 'none';

    if (list) {
        list.innerHTML = '';
        if (notifications.length === 0) {
            list.innerHTML = '<p class="no-notifications">No notifications yet.</p>';
        } else {
            notifications.forEach(notification => {
                const item = document.createElement('div');
                item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
                item.innerHTML = `
                    <p>${notification.message}</p>
                    <small>${new Date(notification.timestamp).toLocaleString()}</small>
                `;
                item.addEventListener('click', () => markAsRead(notification.id));
                list.appendChild(item);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNotificationUI();
    const notificationBtn = document.getElementById('adminNotificationBtn');
    const dropdown = document.getElementById('adminNotificationDropdown');
    const clearAllBtn = document.getElementById('adminClearAllBtn');

    if (notificationBtn && dropdown) {
        notificationBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllNotifications);
    }

    document.addEventListener('click', (event) => {
        if (notificationBtn && dropdown && !notificationBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});

let currentItemElement = null;

function attachViewButtonListeners() {
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            let itemName = '', description = '', location = '', date = '', status = '', imageSrc = '';

            const row = btn.closest('tr');
            if (row) {
                const cells = row.querySelectorAll('td');
                itemName = cells[0] ? cells[0].textContent.trim() : 'Unknown';
                description = cells[1] ? cells[1].textContent.trim() : 'No description';
                location = cells[2] ? cells[2].textContent.trim() : 'Unknown';
                date = cells[3] ? cells[3].textContent.trim() : 'Unknown';
                status = cells[6] ? cells[6].textContent.trim() : 'Unknown';
                imageSrc = btn.getAttribute('data-image') || '';
                currentItemElement = row;
            } else {
                const card = btn.closest('.lost-item-card') || btn.closest('.found-item-card');
                if (card) {
                    itemName = card.getAttribute('data-item-name') || 'Unknown';
                    description = card.getAttribute('data-description') || 'No description';
                    location = card.getAttribute('data-location') || 'Unknown';
                    date = card.getAttribute('data-date') || 'Unknown';
                    status = card.getAttribute('data-status') || 'Unknown';
                    const img = card.querySelector('img');
                    imageSrc = img ? img.src : '';
                    currentItemElement = card;
                }
            }

            document.getElementById('modalTitle').textContent = itemName;
            document.getElementById('modalDescription').innerHTML = `
                <ul class="modal-details">
                    <li><strong>Description:</strong> ${description}</li>
                    <li><strong>Location:</strong> ${location}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Status:</strong> ${status}</li>
                </ul>
            `;
            document.getElementById('modalLocation').style.display = 'none';
            document.getElementById('modalDate').style.display = 'none';
            document.getElementById('modalStatus').style.display = 'none';
            const modalImg = document.getElementById('modalImage');
            if (modalImg) {
                modalImg.src = imageSrc;
                modalImg.style.display = imageSrc ? 'block' : 'none';
            }
            document.getElementById('itemModal').style.display = 'flex';
        });
    });
}

function closePopup() {
    document.getElementById('itemModal').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function() {
    const itemModal = document.getElementById('itemModal');
    if (itemModal) {
        itemModal.style.display = 'none';
        itemModal.addEventListener("click", closePopup);
        const modalContent = itemModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener("click", (e) => e.stopPropagation());
        }
    }
    attachViewButtonListeners();
});

function removeItemFromModal() {
    if (currentItemElement) {
        const itemName = currentItemElement.getAttribute('data-item-name');
        if (itemName) {
            let itemsKey = '';
            if (currentItemElement.classList.contains('lost-item-card')) {
                itemsKey = 'lostItems';
            } else if (currentItemElement.classList.contains('found-item-card')) {
                itemsKey = 'foundItems';
            }

            if (itemsKey) {
                try {
                    const items = JSON.parse(localStorage.getItem(itemsKey)) || [];
                    const updatedItems = items.filter(item => item.itemName !== itemName);
                    localStorage.setItem(itemsKey, JSON.stringify(updatedItems));
                    console.log(`Item "${itemName}" removed from ${itemsKey}`);
                } catch (error) {
                    console.error('Error removing item from localStorage:', error);
                }
            }
        }

        currentItemElement.remove();
        closePopup();

        const activePage = document.querySelector('.page.active');
        if (activePage) {
            if (activePage.id === 'listofl') loadLostItems();
            else if (activePage.id === 'listoff') loadFoundItems();
            else if (activePage.id === 'matcheditems') loadMatchedItems();
            else if (activePage.id === 'claimeditems') loadClaimedItems();
            else if (activePage.id === 'lostitemrequest') loadLostRequests();
            else if (activePage.id === 'founditemrequest') loadFoundRequests();
        }

        showSuccessPopup();
    }
}

function showSuccessPopup() {
    const popup = document.getElementById('popupOverlaySuccess');
    if (popup) popup.style.display = 'flex';
}

function closeSuccessPopup() {
    const popup = document.getElementById('popupOverlaySuccess');
    if (popup) popup.style.display = 'none';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));

    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    if (event && event.target) event.target.classList.add('active');

    if (pageId === 'dashboard') updateDashboard();
    else if (pageId === 'listofl') {
        loadLostItems();
        attachViewButtonListeners();
    } else if (pageId === 'listoff') {
        loadFoundItems();
        attachViewButtonListeners();
        attachMatchButtonListeners();
    } else if (pageId === 'matcheditems') {
        loadMatchedItems();
        attachViewButtonListeners();
    } else if (pageId === 'claimeditems') {
        loadClaimedItems();
        attachViewButtonListeners();
    } else if (pageId === 'itemrecords') {
        loadItemRecords();
        attachViewButtonListeners();
    } else if (pageId === 'lostitemrequest') {
        loadLostRequests();
        attachViewButtonListeners();
    } else if (pageId === 'founditemrequest') {
        loadFoundRequests();
        attachViewButtonListeners();
    } else if (pageId === 'student') {
        loadStudentProfiles();
    }
}

function loadLostItems() {
    try {
        const items = JSON.parse(localStorage.getItem('lostItems')) || [];
        const container = document.querySelector('.lost-scroll-container');
        if (!container) return;

        const existingNames = Array.from(container.querySelectorAll('.lost-item-card')).map(card => card.getAttribute('data-item-name'));

        items.forEach(item => {
            if (!existingNames.includes(item.itemName)) {
                const card = document.createElement('div');
                card.className = 'lost-item-card';
                card.setAttribute('data-item-name', item.itemName);
                card.setAttribute('data-description', item.description);
                card.setAttribute('data-location', item.location);
                card.setAttribute('data-date', item.date);
                card.setAttribute('data-status', item.status);
                card.innerHTML = `
                    <img src="${item.image || 'placeholder.png'}" alt="${item.itemName}" class="lost-item-image" />
                    <h2 class="lost-item-title">${item.itemName}</h2>
                    <p class="lost-item-description">${item.description}</p>
                    <div class="lost-item-buttons">
                        <button class="view-btn">View</button>
                    </div>
                `;
                container.appendChild(card);
            }
        });
        attachViewButtonListeners();
    } catch (error) {
        console.error('Error loading lost items:', error);
    }
}

function loadFoundItems() {
    try {
        const items = JSON.parse(localStorage.getItem('foundItems')) || [];
        const container = document.querySelector('.found-scroll-container');
        if (!container) return;

        const existingNames = Array.from(container.querySelectorAll('.found-item-card')).map(card => card.getAttribute('data-item-name'));

        items.forEach(item => {
            if (!existingNames.includes(item.itemName)) {
                const card = document.createElement('div');
                card.className = 'found-item-card';
                card.setAttribute('data-item-name', item.itemName);
                card.setAttribute('data-description', item.description);
                card.setAttribute('data-location', item.location);
                card.setAttribute('data-date', item.date);
                card.setAttribute('data-status', item.status);
                card.innerHTML = `
                    <img src="${item.image || 'placeholder.png'}" alt="${item.itemName}" class="found-item-image" />
                    <h2 class="found-item-title">${item.itemName}</h2>
                    <p class="found-item-description">${item.description}</p>
                    <div class="found-item-buttons">
                        <button class="view-btn">View</button>
                        <button class="match-btn">Match</button>
                    </div>
                `;
                container.appendChild(card);
            }
        });
        attachViewButtonListeners();
        attachMatchButtonListeners();
    } catch (error) {
        console.error('Error loading found items:', error);
    }
}

document.getElementById('lost-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.lost-item-card');
    cards.forEach(card => {
        const title = card.querySelector('.lost-item-title').textContent.toLowerCase();
        const description = card.querySelector('.lost-item-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

document.getElementById('found-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const container = document.querySelector('.found-scroll-container');
    const cards = container.querySelectorAll('.found-item-card');
    cards.forEach(card => {
        const title = card.querySelector('.found-item-title').textContent.toLowerCase();
        const description = card.querySelector('.found-item-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

function banUser(username) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            registeredUsers[userIndex].status = 'banned';
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            loadStudentProfiles();
            alert(`${username} has been banned.`);
        }
    } catch (error) {
        console.error('Error banning user:', error);
    }
}

function restrictUser(username) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            registeredUsers[userIndex].status = 'restricted';
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            loadStudentProfiles();
            alert(`${username} has been restricted.`);
        }
    } catch (error) {
        console.error('Error restricting user:', error);
    }
}

let currentPage = 1;
const studentsPerPage = 5;
let allStudents = [];
let filteredStudents = [];

function loadStudentProfiles() {
    try {
        const storedStudents = localStorage.getItem('registeredUsers');
        if (storedStudents) {
            allStudents = JSON.parse(storedStudents);
        } else {
            allStudents = [];
        }
        filteredStudents = [...allStudents];
        currentPage = 1;
        updateRowsAndPaginationStudent();
        updateTotalStudents();
    } catch (error) {
        console.error('Error loading student profiles:', error);
        allStudents = [];
        filteredStudents = [];
    }
}

function updateRowsAndPaginationStudent() {
    const tbody = document.getElementById('studentTableBody');
    const noStudentsMessage = document.getElementById('noStudentsMessage');
    if (!tbody || !noStudentsMessage) return;

    tbody.innerHTML = '';

    if (filteredStudents.length === 0) {
        noStudentsMessage.style.display = 'block';
        return;
    }
    noStudentsMessage.style.display = 'none';

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsToShow = filteredStudents.slice(startIndex, endIndex);

    studentsToShow.forEach(student => {
        const fullName = student.fullName || (student.firstName + ' ' + student.lastName) || 'N/A';
        const status = student.status || 'active';
        const row = document.createElement('tr');
        let topButtons = '';
        let bottomButtons = '';

        if (status === 'active') {
            topButtons = `<button class="view-btn" onclick="viewStudent('${student.username}')">View</button><button class="ban-btn" onclick="banUser('${student.username}')">Ban</button>`;
            bottomButtons = `<button class="restrict-btn" onclick="restrictUser('${student.username}')">Restrict</button><button class="remove-btn" onclick="removeStudent('${student.username}')">Remove</button>`;
        } else if (status === 'banned') {
            topButtons = `<button class="view-btn" onclick="viewStudent('${student.username}')">View</button><button class="unban-btn" onclick="unbanUser('${student.username}')">Unban</button>`;
            bottomButtons = `<button class="remove-btn" onclick="removeStudent('${student.username}')">Remove</button><div></div>`;
        } else if (status === 'restricted') {
            topButtons = `<button class="view-btn" onclick="viewStudent('${student.username}')">View</button><button class="unrestrict-btn" onclick="unrestrictUser('${student.username}')">Unrestrict</button>`;
            bottomButtons = `<button class="ban-btn" onclick="banUser('${student.username}')">Ban</button><button class="remove-btn" onclick="removeStudent('${student.username}')">Remove</button>`;
        }

        row.innerHTML = `
            <td>${student.username}</td>
            <td>${fullName}</td>
            <td>${student.course || 'N/A'}</td>
            <td>${student.yearLevel || 'N/A'}</td>
            <td>${status}</td>
            <td>
                <div class="action-buttons">
                    <div class="top-row">${topButtons}</div>
                    <div class="bottom-row">${bottomButtons}</div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    const paginationDiv = document.getElementById('paginationStudent');
    if (paginationDiv) {
        paginationDiv.innerHTML = `
            <button onclick="changeStudentPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            ${Array.from({ length: totalPages }, (_, i) => `<button onclick="changeStudentPage(${i + 1})" ${currentPage === i + 1 ? 'class="active"' : ''}>${i + 1}</button>`).join('')}
            <button onclick="changeStudentPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
    }
}

function changeStudentPage(page) {
    currentPage = page;
    updateRowsAndPaginationStudent();
}

function removeStudent(username) {
    try {
        allStudents = allStudents.filter(s => s.username !== username);
        localStorage.setItem('registeredUsers', JSON.stringify(allStudents));
        filteredStudents = [...allStudents];
        updateRowsAndPaginationStudent();
        updateTotalStudents();
        alert(`${username} has been removed.`);
    } catch (error) {
        console.error('Error removing student:', error);
    }
}

function unbanUser(username) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            registeredUsers[userIndex].status = 'active';
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            loadStudentProfiles();
            alert(`${username} has been unbanned.`);
        }
    } catch (error) {
        console.error('Error unbanning user:', error);
    }
}

function unrestrictUser(username) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.username === username);
        if (userIndex !== -1) {
            registeredUsers[userIndex].status = 'active';
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            loadStudentProfiles();
            alert(`${username} has been unrestricted.`);
        }
    } catch (error) {
        console.error('Error unrestricting user:', error);
    }
}

function viewStudent(username) {
    try {
        const student = allStudents.find(s => s.username === username);
        if (student) {
            const fullName = student.fullName || (student.firstName + ' ' + student.lastName) || 'N/A';
            const status = student.status || 'active';
            document.getElementById('modalTitle').textContent = fullName;
            document.getElementById('modalDescription').innerHTML = `
                <ul class="modal-details">
                    <li><strong>Username:</strong> ${student.username}</li>
                    <li><strong>Email:</strong> ${student.email}</li>
                    <li><strong>Course:</strong> ${student.course || 'N/A'}</li>
                    <li><strong>Year Level:</strong> ${student.yearLevel || 'N/A'}</li>
                    <li><strong>Role:</strong> ${student.role}</li>
                    <li><strong>Status:</strong> ${status}</li>
                </ul>
            `;
            document.getElementById('modalLocation').style.display = 'none';
            document.getElementById('modalDate').style.display = 'none';
            document.getElementById('modalStatus').style.display = 'none';
            document.getElementById('modalImage').style.display = 'none';
            currentItemElement = { username: username };

            const buttonsDiv = document.querySelector('.modal-content .buttons');
            if (buttonsDiv) {
                buttonsDiv.innerHTML = `<button onclick="closePopup()" class="back-btn">Back</button>`;
            }

            document.getElementById('itemModal').style.display = 'flex';
        }
    } catch (error) {
        console.error('Error viewing student:', error);
    }
}

function updateTotalStudents() {
    const totalStudentsEl = document.getElementById('totalStudents');
    if (totalStudentsEl) totalStudentsEl.textContent = allStudents.length;
}

function searchStudent() {
    const searchTerm = document.getElementById('searchBarStudent').value.toLowerCase();
    filteredStudents = allStudents.filter(student => {
        const fullName = student.fullName || (student.firstName + ' ' + student.lastName) || '';
        return student.username.toLowerCase().includes(searchTerm) || fullName.toLowerCase().includes(searchTerm);
    });
    currentPage = 1;
    updateRowsAndPaginationStudent();
}

let lostRequestsCurrentPage = 1;
const lostRequestsPerPage = 4;

function loadLostRequests() {
    try {
        console.log('Loading lost requests');
        const requests = JSON.parse(localStorage.getItem('lostRequests')) || [];
        console.log('Lost requests from localStorage:', requests);
        const section = document.getElementById('lostitemrequest');
        if (!section) return;
        section.innerHTML = '<h1>Lost Item Requests</h1><p class="par">Section for reviewing and approving users lost item reports.</p><div class="request-container"></div>';
        const container = section.querySelector('.request-container');

        const totalPages = Math.ceil(requests.length / lostRequestsPerPage);
        const startIndex = (lostRequestsCurrentPage - 1) * lostRequestsPerPage;
        const endIndex = startIndex + lostRequestsPerPage;
        const requestsToShow = requests.slice(startIndex, endIndex);

        if (requestsToShow.length === 0) {
            console.log('No lost requests found');
            container.innerHTML = '<p>No lost item requests yet.</p>';
        } else {
            requestsToShow.forEach(item => {
                console.log('Rendering lost request:', item);
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <img src="${item.image || 'placeholder.png'}" alt="${item.itemName}" style="width: 100px; height: 100px;">
                    <h3>${item.itemName}</h3>
                    <ul class="request-details">
                        <li><strong>Description:</strong> ${item.description}</li>
                        <li><strong>Date Lost:</strong> ${item.date}</li>
                    </ul>
                    <button class="valid-btn" onclick="openRequestModal(${item.id}, 'lost')">Valid</button>
                `;
                container.appendChild(card);
            });
        }

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = `
            <button onclick="changeLostRequestsPage(${lostRequestsCurrentPage - 1})" ${lostRequestsCurrentPage === 1 ? 'disabled' : ''}>Previous</button>
            ${Array.from({ length: totalPages }, (_, i) => `<button onclick="changeLostRequestsPage(${i + 1})" ${lostRequestsCurrentPage === i + 1 ? 'class="active"' : ''}>${i + 1}</button>`).join('')}
            <button onclick="changeLostRequestsPage(${lostRequestsCurrentPage + 1})" ${lostRequestsCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
        section.appendChild(paginationDiv);
    } catch (error) {
        console.error('Error loading lost requests:', error);
    }
}

function changeLostRequestsPage(page) {
    lostRequestsCurrentPage = page;
    loadLostRequests();
}

let foundRequestsCurrentPage = 1;
const foundRequestsPerPage = 4;

function loadFoundRequests() {
    try {
        console.log('Loading found requests');
        const requests = JSON.parse(localStorage.getItem('foundRequests')) || [];
        console.log('Found requests from localStorage:', requests);
        const section = document.getElementById('founditemrequest');
        if (!section) return;
        section.innerHTML = '<h1>Found Item Requests</h1><p class="par">Section for reviewing and approving users found item submissions.</p><div class="request-container"></div>';
        const container = section.querySelector('.request-container');

        const totalPages = Math.ceil(requests.length / foundRequestsPerPage);
        const startIndex = (foundRequestsCurrentPage - 1) * foundRequestsPerPage;
        const endIndex = startIndex + foundRequestsPerPage;
        const requestsToShow = requests.slice(startIndex, endIndex);

        if (requestsToShow.length === 0) {
            console.log('No found requests found');
            container.innerHTML = '<p>No found item requests yet.</p>';
        } else {
            requestsToShow.forEach(item => {
                console.log('Rendering found request:', item);
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <img src="${item.image || 'placeholder.png'}" alt="${item.itemName}" style="width: 100px; height: 100px;">
                    <h3>${item.itemName}</h3>
                    <ul class="request-details">
                        <li><strong>Description:</strong> ${item.description}</li>
                        <li><strong>Date Found:</strong> ${item.date}</li>
                    </ul>
                    <button class="valid-btn" onclick="openRequestModal(${item.id}, 'found')">Valid</button>
                `;
                container.appendChild(card);
            });
        }

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = `
            <button onclick="changeFoundRequestsPage(${foundRequestsCurrentPage - 1})" ${foundRequestsCurrentPage === 1 ? 'disabled' : ''}>Previous</button>
            ${Array.from({ length: totalPages }, (_, i) => `<button onclick="changeFoundRequestsPage(${i + 1})" ${foundRequestsCurrentPage === i + 1 ? 'class="active"' : ''}>${i + 1}</button>`).join('')}
            <button onclick="changeFoundRequestsPage(${foundRequestsCurrentPage + 1})" ${foundRequestsCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
        section.appendChild(paginationDiv);
    } catch (error) {
        console.error('Error loading found requests:', error);
    }
}

function changeFoundRequestsPage(page) {
    foundRequestsCurrentPage = page;
    loadFoundRequests();
}

let currentRequestType = null;
let currentRequestId = null;

function openRequestModal(id, type) {
    try {
        currentRequestId = id;
        currentRequestType = type;
        const requests = JSON.parse(localStorage.getItem(`${type}Requests`)) || [];
        const item = requests.find(r => r.id === id);
        if (!item) {
            alert('Request not found.');
            return;
        }

        document.getElementById('requestModalTitle').textContent = item.itemName;
        document.getElementById('requestModalDescription').innerHTML = `
            <ul class="modal-details">
                <li><strong>Description:</strong> ${item.description}</li>
                <li><strong>Location:</strong> ${item.location}</li>
                <li><strong>Date ${type === 'lost' ? 'Lost' : 'Found'}:</strong> ${item.date}</li>
                <li><strong>Submitted by:</strong> ${item.user}</li>
            </ul>
        `;
        const modalImg = document.getElementById('requestModalImage');
        if (modalImg) {
            modalImg.src = item.image || 'placeholder.png';
            modalImg.style.display = 'block';
        }
        document.getElementById('requestModal').style.display = 'flex';
    } catch (error) {
        console.error('Error opening request modal:', error);
    }
}

function closeRequestModal() {
    const modal = document.getElementById('requestModal');
    if (modal) modal.style.display = 'none';
}

function approveRequest(type, id) {
    try {
        console.log('Approving request:', type, id);
        if (!type || !id) {
            alert('Invalid request data.');
            return;
        }

        const requests = JSON.parse(localStorage.getItem(`${type}Requests`)) || [];
        const itemIndex = requests.findIndex(r => r.id === id);
        if (itemIndex === -1) {
            alert('Request not found.');
            return;
        }

        const item = requests.splice(itemIndex, 1)[0];
        item.status = 'approved';

        const listKey = type === 'lost' ? 'lostItems' : 'foundItems';
        const list = JSON.parse(localStorage.getItem(listKey)) || [];
        list.push(item);
        localStorage.setItem(listKey, JSON.stringify(list));
        localStorage.setItem(`${type}Requests`, JSON.stringify(requests));

        const notificationMessage = type === 'lost' 
            ? 'Your lost item has been approved and added to the list.' 
            : 'Your found item has been approved. Please submit it to the Student Council Office.';
        addNotification(notificationMessage, 'success', item.user);

        closeRequestModal();
        updateDashboard();
        if (type === 'lost') loadLostRequests(); else loadFoundRequests();
        if (document.querySelector('.page.active')?.id === 'listofl' && type === 'lost') loadLostItems();
        if (document.querySelector('.page.active')?.id === 'listoff' && type === 'found') loadFoundItems();

        alert('Request approved successfully!');
    } catch (error) {
        console.error('Error approving request:', error);
        alert('An error occurred while approving the request.');
    }
}


function rejectRequest(type, id) {
    try {
        console.log('Rejecting request:', type, id);
        if (!type || !id) {
            alert('Invalid request data.');
            return;
        }

        const requests = JSON.parse(localStorage.getItem(`${type}Requests`)) || [];
        const itemIndex = requests.findIndex(r => r.id === id);
        if (itemIndex === -1) {
            alert('Request not found.');
            return;
        }

        const item = requests.splice(itemIndex, 1)[0];
        localStorage.setItem(`${type}Requests`, JSON.stringify(requests));

        addNotification(`Your ${type} item "${item.itemName}" has been rejected.`, 'error', item.user);

        closeRequestModal();
        updateDashboard();
        if (type === 'lost') loadLostRequests(); else loadFoundRequests();

        alert('Request rejected successfully!');
    } catch (error) {
        console.error('Error rejecting request:', error);
        alert('An error occurred while rejecting the request.');
    }
}

function updateDashboard() {
    try {
        const lostRequests = JSON.parse(localStorage.getItem('lostRequests')) || [];
        const foundRequests = JSON.parse(localStorage.getItem('foundRequests')) || [];
        const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
        const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
        const claimedItems = JSON.parse(localStorage.getItem('claimedItems')) || [];
        const matchedItems = JSON.parse(localStorage.getItem('matchedItems')) || [];
        const itemRecords = JSON.parse(localStorage.getItem('itemRecords')) || [];
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        document.getElementById('lostRequests').textContent = lostRequests.length;
        document.getElementById('foundRequests').textContent = foundRequests.length;
        document.getElementById('totalLost').textContent = lostItems.length + lostRequests.length;
        document.getElementById('totalFound').textContent = foundItems.length + foundRequests.length;
        document.getElementById('totalClaims').textContent = claimedItems.length;
        document.getElementById('totalMatches').textContent = matchedItems.length;
        document.getElementById('totalRecords').textContent = itemRecords.length;
        document.getElementById('totalStudents').textContent = registeredUsers.length;
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

function scrollCarousel(type, direction) {
    const containerClass = type === 'lost' ? '.lost-scroll-container' : '.found-scroll-container';
    const container = document.querySelector(containerClass);
    if (!container) {
        console.error(`Scroll container for ${type} not found.`);
        return;
    }
    const scrollAmount = 300;
    const newScrollLeft = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
}

let currentFoundItem = null;

function attachMatchButtonListeners() {
    document.querySelectorAll(".match-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const card = btn.closest('.found-item-card');
            if (card) {
                currentFoundItem = {
                    itemName: card.getAttribute('data-item-name'),
                    description: card.getAttribute('data-description'),
                    location: card.getAttribute('data-location'),
                    date: card.getAttribute('data-date'),
                    status: card.getAttribute('data-status'),
                    image: card.querySelector('img').src
                };
            }
            document.getElementById('matchModal').style.display = 'flex';
        });
    });
}

function closeMatchModal() {
    document.getElementById('matchModal').style.display = 'none';
}

function showLostItemsTable() {
    closeMatchModal();
    try {
        const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
        const tableBody = document.getElementById('lostItemsTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const itemsToShow = lostItems.slice(0, 5);

        if (itemsToShow.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No lost items available.</td></tr>';
        } else {
            itemsToShow.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.itemName}</td>
                    <td>${item.description.substring(0, 100)}...</td>
                    <td><button class="match-confirm-btn" onclick="confirmMatch('${item.itemName}')">Match</button></td>
                `;
                tableBody.appendChild(row);
            });
        }
        document.getElementById('lostItemsModal').style.display = 'flex';
    } catch (error) {
        console.error('Error showing lost items table:', error);
    }
}

function closeLostItemsModal() {
    document.getElementById('lostItemsModal').style.display = 'none';
}

function confirmMatch(lostItemName) {
    if (!currentFoundItem) {
        alert('No found item selected for matching.');
        return;
    }

    try {
        const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
        const lostItem = lostItems.find(item => item.itemName === lostItemName);
        if (!lostItem) {
            alert('Lost item not found.');
            return;
        }

        if (!isLocalStorageSupported()) {
            alert('localStorage is not supported or disabled.');
            return;
        }

        const match = {
            id: Date.now(),
            foundItem: currentFoundItem,
            lostItem: lostItem,
            status: 'matched',
            matchedDate: new Date().toISOString()
        };

        const matchedItems = JSON.parse(localStorage.getItem('matchedItems')) || [];
        matchedItems.push(match);
        localStorage.setItem('matchedItems', JSON.stringify(matchedItems));

        addNotification(`Your lost item "${lostItem.itemName}" has been matched with a found item. Please wait while we verify the details.`, 'info', lostItem.user);

        alert(`Match confirmed!`);
        closeLostItemsModal();
        showPage('matcheditems');
        updateDashboard();
    } catch (error) {
        console.error('Error confirming match:', error);
        alert('An error occurred while matching.');
    }
}

let matchedItemsCurrentPage = 1;
const matchedItemsPerPage = 2;

function loadMatchedItems() {
    try {
        console.log('Loading matched items...');
        const matchedItems = JSON.parse(localStorage.getItem('matchedItems')) || [];
        console.log('Matched items:', matchedItems);
        const container = document.getElementById('matcheditems');
        if (!container) return;

        const totalPages = Math.ceil(matchedItems.length / matchedItemsPerPage);
        const startIndex = (matchedItemsCurrentPage - 1) * matchedItemsPerPage;
        const endIndex = startIndex + matchedItemsPerPage;
        const itemsToShow = matchedItems.slice(startIndex, endIndex);

        container.innerHTML = '<h1>Matched Items</h1><p class="matched">Collection of items paired between lost and found reports.</p>';

        if (matchedItems.length === 0) {
            container.innerHTML += '<p class="request-container">No matched items yet.</p>';
            return;
        }

        itemsToShow.forEach(match => {
            const section = document.createElement('div');
            section.className = 'matched-section';
            section.innerHTML = `
                <div class="item found">
                    <h2>Found Item</h2>
                    <div class="item-content">
                        <img src="${match.foundItem.image || 'placeholder.png'}" alt="${match.foundItem.itemName}">
                        <div class="details">
                            <ul>
                                <li><strong>Description:</strong> ${match.foundItem.description}</li>
                                <li><strong>Location:</strong> ${match.foundItem.location}</li>
                                <li><strong>Date Found:</strong> ${match.foundItem.date}</li>
                                <li><strong>User:</strong> ${match.foundItem.user || 'Unknown'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="middle">
                    <div class="divider-left"></div>
                    <div class="divider-right"></div>
                    <h3>Matched</h3>
                    <div class="status">Status: Processing...</div>
                    <button class="claim-btn" onclick="claimMatch(${match.id})">Claim</button>
                </div>
                <div class="item lost">
                    <h2>Lost Item</h2>
                    <div class="item-content">
                        <img src="${match.lostItem.image || 'placeholder.png'}" alt="${match.lostItem.itemName}">
                        <div class="details">
                            <ul>
                                <li><strong>Description:</strong> ${match.lostItem.description}</li>
                                <li><strong>Location:</strong> ${match.lostItem.location}</li>
                                <li><strong>Date Lost:</strong> ${match.lostItem.date}</li>
                                <li><strong>User:</strong> ${match.lostItem.user || 'Unknown'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(section);
        });

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = `
            <button onclick="changeMatchedItemsPage(${matchedItemsCurrentPage - 1})" ${matchedItemsCurrentPage === 1 ? 'disabled' : ''}>Previous</button>
            ${Array.from({ length: totalPages }, (_, i) => `<button onclick="changeMatchedItemsPage(${i + 1})" ${matchedItemsCurrentPage === i + 1 ? 'class="active"' : ''}>${i + 1}</button>`).join('')}
            <button onclick="changeMatchedItemsPage(${matchedItemsCurrentPage + 1})" ${matchedItemsCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
        container.appendChild(paginationDiv);
    } catch (error) {
        console.error('Error loading matched items:', error);
    }
}

function changeMatchedItemsPage(page) {
    matchedItemsCurrentPage = page;
    loadMatchedItems();
}

function claimMatch(matchId) {
    try {
        const matchedItems = JSON.parse(localStorage.getItem('matchedItems')) || [];
        const claimedItems = JSON.parse(localStorage.getItem('claimedItems')) || [];
        const matchIndex = matchedItems.findIndex(m => m.id === matchId);

        if (matchIndex === -1) {
            alert('Match not found.');
            return;
        }

        const match = matchedItems.splice(matchIndex, 1)[0];
        match.status = 'ready for claim';
        claimedItems.push(match);

        localStorage.setItem('matchedItems', JSON.stringify(matchedItems));
        localStorage.setItem('claimedItems', JSON.stringify(claimedItems));

        addNotification('Your item has been matched with the submitted details. Please proceed to the Student Council Office to claim it.', 'info', match.lostItem.user);

        alert('Item claimed successfully!');
        loadMatchedItems();
        updateDashboard();
    } catch (error) {
        console.error('Error claiming match:', error);
        alert('An error occurred while claiming the item.');
    }
}


let claimedItemsCurrentPage = 1;
const claimedItemsPerPage = 2;

function loadClaimedItems() {
    try {
        console.log('Loading claimed items...');
        const claimedItems = JSON.parse(localStorage.getItem('claimedItems')) || [];
        console.log('Claimed items:', claimedItems);
        const container = document.getElementById('claimeditems');
        if (!container) return;

        const totalPages = Math.ceil(claimedItems.length / claimedItemsPerPage);
        const startIndex = (claimedItemsCurrentPage - 1) * claimedItemsPerPage;
        const endIndex = startIndex + claimedItemsPerPage;
        const itemsToShow = claimedItems.slice(startIndex, endIndex);

        container.innerHTML = '<h1>Claimed Items</h1><p class="claimed">For releasing items to users who confirmed a match.</p>';

        if (claimedItems.length === 0) {
            container.innerHTML += '<p class="request-container">No claimed items yet.</p>';
            return;
        }

        itemsToShow.forEach(claim => {
            const buttonText = claim.status === 'completed' ? 'Done' : 'Complete';
            const section = document.createElement('div');
            section.className = 'matched-section';
            section.innerHTML = `
                <div class="item found">
                    <h2>Found Item</h2>
                    <div class="item-content">
                        <img src="${claim.foundItem.image || 'placeholder.png'}" alt="${claim.foundItem.itemName}">
                        <div class="details">
                            <ul>
                                <li><strong>Description:</strong> ${claim.foundItem.description}</li>
                                <li><strong>Location:</strong> ${claim.foundItem.location}</li>
                                <li><strong>Date Found:</strong> ${claim.foundItem.date}</li>
                                <li><strong>User:</strong> ${claim.foundItem.user || 'Unknown'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="middle">
                    <div class="divider-left"></div>
                    <div class="divider-right"></div>
                    <h3>Claimed</h3>
                    <div class="status">Status: ${claim.status}</div>
                    <button class="complete-btn" onclick="completeClaim(${claim.id})">${buttonText}</button>
                </div>
                <div class="item lost">
                    <h2>Lost Item</h2>
                    <div class="item-content">
                        <img src="${claim.lostItem.image || 'placeholder.png'}" alt="${claim.lostItem.itemName}">
                        <div class="details">
                            <ul>
                                <li><strong>Description:</strong> ${claim.lostItem.description}</li>
                                <li><strong>Location Lost:</strong> ${claim.lostItem.location}</li>
                                <li><strong>Date Lost:</strong> ${claim.lostItem.date}</li>
                                <li><strong>User:</strong> ${claim.lostItem.user || 'Unknown'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(section);
        });

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.innerHTML = `
            <button onclick="changeClaimedItemsPage(${claimedItemsCurrentPage - 1})" ${claimedItemsCurrentPage === 1 ? 'disabled' : ''}>Previous</button>
            ${Array.from({ length: totalPages }, (_, i) => `<button onclick="changeClaimedItemsPage(${i + 1})" ${claimedItemsCurrentPage === i + 1 ? 'class="active"' : ''}>${i + 1}</button>`).join('')}
            <button onclick="changeClaimedItemsPage(${claimedItemsCurrentPage + 1})" ${claimedItemsCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
        container.appendChild(paginationDiv);
    } catch (error) {
        console.error('Error loading claimed items:', error);
    }
}

function changeClaimedItemsPage(page) {
    claimedItemsCurrentPage = page;
    loadClaimedItems();
}

function completeClaim(claimId) {
    try {
        const claimedItems = JSON.parse(localStorage.getItem('claimedItems')) || [];
        const itemRecords = JSON.parse(localStorage.getItem('itemRecords')) || [];
        const claimIndex = claimedItems.findIndex(c => c.id === claimId);

        if (claimIndex === -1) {
            alert('Claim not found.');
            return;
        }

        const claim = claimedItems[claimIndex];

        if (claim.status === 'ready for claim') {
            claim.status = 'completed';
            localStorage.setItem('claimedItems', JSON.stringify(claimedItems));

            addNotification('You have already received your lost item.', 'info', claim.lostItem.user);

            alert('Item marked as completed!');
        } else if (claim.status === 'completed') {
            itemRecords.push(claim);
            claimedItems.splice(claimIndex, 1);
            localStorage.setItem('claimedItems', JSON.stringify(claimedItems));
            localStorage.setItem('itemRecords', JSON.stringify(itemRecords));
            alert('Item moved to Item Records!');
        }

        loadClaimedItems();
        updateDashboard();
    } catch (error) {
        console.error('Error completing claim:', error);
        alert('An error occurred while completing the claim.');
    }
}


let itemRecordsCurrentPage = 1;
const itemRecordsPerPage = 4;

function loadItemRecords() {
    try {
        console.log('Loading item records...');
        const itemRecords = JSON.parse(localStorage.getItem('itemRecords')) || [];
        console.log('Item records:', itemRecords);
        const container = document.getElementById('itemrecords');
        if (!container) return;

        container.innerHTML = '<h1>Item Records</h1><button id="downloadExcelBtn" class="download-btn">Download Excel</button><table id="recordsTable"><thead><tr><th>Found Item</th><th>Lost Item</th><th>Description</th><th>Location</th><th>Date</th><th>User</th><th>Status</th></tr></thead><tbody id="recordsTableBody"></tbody></table>';

        const tableBody = document.getElementById('recordsTableBody');
        if (itemRecords.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No completed items yet.</td></tr>';
            return;
        }

        itemRecords.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.foundItem.itemName}</td>
                <td>${item.lostItem.itemName}</td>
                <td>
                    <ul class="table-list">
                        <li><strong>Found:</strong> ${item.foundItem.description}</li>
                        <li><strong>Lost:</strong> ${item.lostItem.description}</li>
                    </ul>
                </td>
                <td>
                    <ul class="table-list">
                        <li><strong>Found:</strong> ${item.foundItem.location}</li>
                        <li><strong>Lost:</strong> ${item.lostItem.location}</li>
                    </ul>
                </td>
                <td>
                    <ul class="table-list">
                        <li><strong>Found:</strong> ${item.foundItem.date}</li>
                        <li><strong>Lost:</strong> ${item.lostItem.date}</li>
                    </ul>
                </td>
                <td>
                    <ul class="table-list">
                        <li><strong>Found:</strong> ${item.foundItem.user || 'Unknown'}</li>
                        <li><strong>Lost:</strong> ${item.lostItem.user || 'Unknown'}</li>
                    </ul>
                </td>
                <td>${item.status}</td>
            `;
            tableBody.appendChild(row);
        });

        const downloadBtn = document.getElementById('downloadExcelBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => downloadRecordsExcel(itemRecords));
        }
    } catch (error) {
        console.error('Error loading item records:', error);
    }
}

function downloadRecordsExcel(items) {
    try {
        let csv = 'Found Item,Lost Item,Description (Found),Description (Lost),Location (Found),Location (Lost),Date (Found),Date (Lost),User (Found),User (Lost),Status\n';

        items.forEach(item => {
            csv += `"${item.foundItem.itemName}","${item.lostItem.itemName}","${item.foundItem.description}","${item.lostItem.description}","${item.foundItem.location}","${item.lostItem.location}","${item.foundItem.date}","${item.lostItem.date}","${item.foundItem.user || 'Unknown'}","${item.lostItem.user || 'Unknown'}","${item.status}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'item_records.csv';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading records:', error);
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));

    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    if (event && event.target) event.target.classList.add('active');

    if (pageId === 'dashboard') updateDashboard();
    else if (pageId === 'listofl') {
        loadLostItems();
        attachViewButtonListeners();
    } else if (pageId === 'listoff') {
        loadFoundItems();
        attachViewButtonListeners();
        attachMatchButtonListeners();
    } else if (pageId === 'matcheditems') {
        loadMatchedItems();
        attachViewButtonListeners();
    } else if (pageId === 'claimeditems') {
        loadClaimedItems();
        attachViewButtonListeners();
    } else if (pageId === 'itemrecords') {
        loadItemRecords();
        attachViewButtonListeners();
    } else if (pageId === 'lostitemrequest') {
        loadLostRequests();
        attachViewButtonListeners();
    } else if (pageId === 'founditemrequest') {
        loadFoundRequests();
        attachViewButtonListeners();
    } else if (pageId === 'student') {
        loadStudentProfiles();
    }
}