function updateUserMenu() {
    const username = localStorage.getItem('username');
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
    localStorage.removeItem('username');
    updateUserMenu();
});

document.getElementById('userMenuButton').addEventListener('click', () => {
    const username = localStorage.getItem('username');
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
