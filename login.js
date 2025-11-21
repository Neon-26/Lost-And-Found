function togglePassword() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error");
    const errorMessageDiv = document.getElementById("errorMessage");
    const successMsg = document.getElementById("successMessage");

    errorMsg.textContent = "";
    errorMessageDiv.style.display = "none";
    errorMessageDiv.textContent = "";
    successMsg.style.display = "none";

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        successMsg.textContent = "Registration successful! Please log in.";
        successMsg.style.display = "block";
        window.history.replaceState(null, null, window.location.pathname);
    }

    if (!username || !password) {
        errorMsg.textContent = "Please enter both username and password.";
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const admin = { user: "admin", pass: "admin123" };
    const admin1 = { user: "Jericho", pass: "lejano26" };
    const user = { user: "user", pass: "user123" };
    const user1 = { user: "Charles", pass: "gaviola" };

    const hardcodedAccounts = [admin, admin1, user, user1];

    const registeredUser = registeredUsers.find(u => u.username === username);
    const hardcodedUser = hardcodedAccounts.find(u => u.user === username);

    if (registeredUser) {
        if (registeredUser.password === password) {
            if (registeredUser.role === "admin") {
                sessionStorage.setItem('adminUsername', username);
                window.location.href = "Admin_Interface/admin.html";
            } else {
                sessionStorage.setItem('userUsername', username);
                window.location.href = "User_Interface/user.html";
            }
        } else {
            errorMessageDiv.textContent = "Incorrect username or password.";
            errorMessageDiv.style.display = "block";
        }
    } else if (hardcodedUser) {
        if (hardcodedUser.pass === password) {
            if (hardcodedUser === admin || hardcodedUser === admin1) {
                sessionStorage.setItem('adminUsername', username);
                window.location.href = "Admin_Interface/admin.html";
            } else {
                sessionStorage.setItem('userUsername', username);
                window.location.href = "User_Interface/user.html";
            }
        } else {
            errorMessageDiv.textContent = "Incorrect username or password.";
            errorMessageDiv.style.display = "block";
        }
    } else {
        errorMsg.textContent = "No account found. Please register.";
    }
}