function updateUserMenu() {
    console.log('Updating user menu...');
    const username = sessionStorage.getItem('userUsername');  
    const usernameSpan = document.getElementById('username');
    const dropdown = document.getElementById('userMenuDropdown');

    if (usernameSpan) {
        if (username) {
            usernameSpan.textContent = username;
            console.log('Username set:', username);
        } else {
            usernameSpan.textContent = 'Login';
            console.log('No username, redirecting to login');
            window.location.href = '../index.html';
        }
    } else {
        console.error('Username span (#username) not found in HTML!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dropdown...');

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clicked');
            sessionStorage.removeItem('userUsername'); 
            updateUserMenu();
        });
    } else {
        console.error('Logout link (#logoutLink) not found!');
    }

    const userMenuButton = document.getElementById('userMenuButton');
    if (userMenuButton) {
        userMenuButton.addEventListener('click', function() {
            console.log('User menu button clicked');
            const username = sessionStorage.getItem('userUsername'); 
            const dropdown = document.getElementById('userMenuDropdown');
            if (username && dropdown) {
                dropdown.classList.toggle('show');
                console.log('Dropdown toggled, show class:', dropdown.classList.contains('show'));
            } else {
                console.log('No username or dropdown not found');
            }
        });
    } else {
        console.error('User menu button (#userMenuButton) not found!');
    }

    document.addEventListener('click', function(event) {
        const button = document.getElementById('userMenuButton');
        const dropdown = document.getElementById('userMenuDropdown');
        if (button && dropdown && !button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
            console.log('Dropdown closed via outside click');
        }
    });
});

updateUserMenu();

function loadNotifications() {
    const username = sessionStorage.getItem('userUsername');
    if (!username) return;
    const key = `notifications_${username}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveNotifications(notifications) {
    const username = sessionStorage.getItem('userUsername');
    if (!username) return;
    const key = `notifications_${username}`;
    localStorage.setItem(key, JSON.stringify(notifications));
}

function addNotification(message, type = 'info') {
    const notifications = loadNotifications();
    notifications.unshift({
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
    });
    saveNotifications(notifications);
    updateNotificationUI();
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
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationList');

    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline' : 'none';

    list.innerHTML = '';
    if (notifications.length === 0) {
        list.innerHTML = '<p class="no-notifications">No notifications yet.</p>';
        return;
    }

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

document.addEventListener('DOMContentLoaded', () => {
    updateNotificationUI();
    const notificationBtn = document.getElementById('notificationBtn');
    const dropdown = document.getElementById('notificationDropdown');
    const clearAllBtn = document.getElementById('clearAllBtn');

    if (notificationBtn && dropdown) {
        notificationBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllNotifications);
    }

    document.addEventListener('click', (event) => {
        if (!notificationBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});

function closePopup() {
    document.getElementById("itemModal").style.display = "none";
}

function updateDashboard() {
    try {
        const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
        const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
        const claimedItems = JSON.parse(localStorage.getItem('claimedItems')) || [];
        const itemRecords = JSON.parse(localStorage.getItem('itemRecords')) || [];

        const hardcodedLost = document.querySelectorAll('#listofl .lost-item-card').length;
        const hardcodedFound = document.querySelectorAll('#listoff .found-item-card').length;

        console.log('Dynamic lost items:', lostItems.length);
        console.log('Hardcoded lost items:', hardcodedLost);
        console.log('Dynamic found items:', foundItems.length);
        console.log('Hardcoded found items:', hardcodedFound);

        const totalReported = lostItems.length + hardcodedLost;
        const itemsFound = foundItems.length + hardcodedFound; 
        const itemsLost = lostItems.length + hardcodedLost;  
        const itemsReturned = itemRecords.length;       
        const pendingClaims = claimedItems.filter(item => item.status !== 'completed').length;
        const councilInquiries = 12; 

        document.getElementById('total-reported').textContent = totalReported;
        document.getElementById('items-found').textContent = itemsFound;
        document.getElementById('items-lost').textContent = itemsLost;
        document.getElementById('items-returned').textContent = itemsReturned;
        document.getElementById('pending-claims').textContent = pendingClaims;
        document.getElementById('council-inquiries').textContent = councilInquiries;

        console.log('Dashboard updated with real data (including hardcoded):', { totalReported, itemsFound, itemsLost, itemsReturned, pendingClaims, councilInquiries });
    } catch (error) {
        console.error('Error updating dashboard:', error);
        document.getElementById('total-reported').textContent = '0';
        document.getElementById('items-found').textContent = '0';
        document.getElementById('items-lost').textContent = '0';
        document.getElementById('items-returned').textContent = '45'; 
        document.getElementById('pending-claims').textContent = '0';
        document.getElementById('council-inquiries').textContent = '12';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, updating dashboard');
    updateDashboard();
});

const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});
backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });