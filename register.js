function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    register();
});

function register() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const authCode = document.getElementById("authCode").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("error");

    errorMsg.textContent = "";

    if (!firstName || !lastName || !username || !email || !authCode || !password || !confirmPassword) {
        errorMsg.textContent = "Please fill in all required fields.";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters long.";
        return;
    }

    let role = "user";
    if (authCode === "admin123") {
        role = "admin";
    } else if (authCode === "student123") {
        role = "user";
    } else {
        errorMsg.textContent = "Invalid authentication code.";
        return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const existingUser = registeredUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
        if (existingUser.username === username) {
            errorMsg.textContent = "Username already exists.";
        } else {
            errorMsg.textContent = "Email already exists.";
        }
        return;
    }

    const newUser = {
        firstName,
        lastName,
        username,
        email,
        password,
        role
    };

    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    window.location.href = "index.html?registered=true";
}